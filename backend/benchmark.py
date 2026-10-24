import time
import json
import os
import shutil
import statistics
from collections import defaultdict
from tqdm import tqdm

from services.git_service import clone_repoository
from services.parser_service import get_repository_files, read_repository_files, IGNORED_DIRS
from services.chunking_service import chunk_documents
from services.vector_store_service import index_chunks, get_collection, client as chromadb_client
from services.repository_service import process_repository_query
import services.vector_store_service

# Monkey-patch search_repository to measure retrieval latency and chunk counts
original_search_repository = services.vector_store_service.search_repository
search_measurements = []

def patched_search_repository(*args, **kwargs):
    start = time.perf_counter()
    res = original_search_repository(*args, **kwargs)
    end = time.perf_counter()
    
    num_chunks = 0
    if res and "documents" in res:
        num_chunks = sum(len(docs) for docs in res["documents"])
        
    search_measurements.append({
        "latency": end - start,
        "chunks_retrieved": num_chunks
    })
    return res

services.vector_store_service.search_repository = patched_search_repository

REPOSITORIES = [
    "https://github.com/tiangolo/fastapi",
    "https://github.com/pallets/flask",
    "https://github.com/expressjs/express",
    "https://github.com/facebook/react",
    "https://github.com/hwchase17/chat-langchain",
    "https://github.com/lodash/lodash",
    "https://github.com/chalk/chalk",
    "https://github.com/psf/requests",
    "https://github.com/pallets/click",
    "https://github.com/encode/starlette",
    "https://github.com/pydantic/pydantic",
    "https://github.com/axios/axios",
    "https://github.com/visionmedia/superagent",
    "https://github.com/koajs/koa",
    "https://github.com/juliangruber/isarray",
    "https://github.com/python/asyncio",
    "https://github.com/miguelgrinberg/Flask-SocketIO"
]

QUERIES = [
    "Where is authentication implemented?",
    "Explain the architecture.",
    "What database is used?",
    "Show API routes.",
    "Where are models defined?",
    "How is configuration handled?",
    "Explain project workflow.",
    "How is logging implemented?",
    "Which files contain middleware?",
    "Summarize this repository."
]

def benchmark_repo(repo_url):
    repo_name = repo_url.rstrip("/").split("/")[-1]
    repo_path = os.path.join("repos", repo_name)
    
    stats = {
        "repository_name": repo_name,
        "repository_url": repo_url,
        "languages": [],
        "total_source_files_processed": 0,
        "files_skipped": 0,
        "total_semantic_chunks": 0,
        "average_chunk_size": 0,
        "largest_chunk": 0,
        "smallest_chunk": 0,
        "cloning_time": 0,
        "parsing_time": 0,
        "chunk_generation_time": 0,
        "indexing_time": 0,
        "total_indexing_time": 0,
        "queries": [],
        "successful_queries": 0,
        "chunks_per_file": 0
    }

    try:
        print(f"\n[{repo_name}] Cloning...")
        t0 = time.perf_counter()
        res = clone_repoository(repo_url)
        t1 = time.perf_counter()
        
        if res.get("success") is False:
            raise Exception(f"Clone failed: {res.get('error')}")
            
        stats["cloning_time"] = t1 - t0

        print(f"[{repo_name}] Parsing...")
        total_files = 0
        for root, dirs, files in os.walk(repo_path):
            dirs[:] = [d for d in dirs if d not in IGNORED_DIRS]
            total_files += len(files)
            
        t0 = time.perf_counter()
        docs = read_repository_files(repo_path)
        t1 = time.perf_counter()
        
        stats["parsing_time"] = t1 - t0
        stats["total_source_files_processed"] = len(docs)
        stats["files_skipped"] = total_files - len(docs)
        
        languages = set()
        for doc in docs:
            ext = os.path.splitext(doc["path"])[1]
            if ext:
                languages.add(ext)
        stats["languages"] = list(languages)

        if len(docs) == 0:
            raise Exception("No documents parsed.")

        print(f"[{repo_name}] Chunking...")
        t0 = time.perf_counter()
        chunks = chunk_documents(docs)
        t1 = time.perf_counter()
        
        stats["chunk_generation_time"] = t1 - t0
        stats["total_semantic_chunks"] = len(chunks)
        stats["chunks_per_file"] = len(chunks) / len(docs) if len(docs) > 0 else 0
        
        if chunks:
            chunk_sizes = [len(c["content"]) for c in chunks]
            stats["average_chunk_size"] = sum(chunk_sizes) / len(chunks)
            stats["largest_chunk"] = max(chunk_sizes)
            stats["smallest_chunk"] = min(chunk_sizes)

        print(f"[{repo_name}] Indexing...")
        t0 = time.perf_counter()
        index_chunks(repo_name, chunks)
        t1 = time.perf_counter()
        
        stats["indexing_time"] = t1 - t0
        stats["total_indexing_time"] = stats["cloning_time"] + stats["parsing_time"] + stats["chunk_generation_time"] + stats["indexing_time"]

        print(f"[{repo_name}] Running Queries...")
        for q in tqdm(QUERIES, desc="Queries", leave=False):
            search_measurements.clear()
            
            t0 = time.perf_counter()
            try:
                ans = process_repository_query(repo_name, q)
                t1 = time.perf_counter()
                
                e2e_time = t1 - t0
                retrieval_time = sum(m["latency"] for m in search_measurements)
                llm_time = e2e_time - retrieval_time
                num_retrieved_chunks = sum(m["chunks_retrieved"] for m in search_measurements)
                
                unique_sources = len(set([s["file"] for s in ans.get("sources", [])]))
                
                stats["queries"].append({
                    "query": q,
                    "retrieval_latency": retrieval_time,
                    "llm_response_latency": llm_time,
                    "end_to_end_time": e2e_time,
                    "num_retrieved_chunks": num_retrieved_chunks,
                    "unique_source_files": unique_sources,
                    "success": True
                })
                stats["successful_queries"] += 1
                
            except Exception as e:
                stats["queries"].append({
                    "query": q,
                    "error": str(e),
                    "success": False
                })

    except Exception as e:
        stats["error"] = str(e)
        print(f"[{repo_name}] ERROR: {e}")
        
    finally:
        print(f"[{repo_name}] Cleaning up...")
        try:
            shutil.rmtree(repo_path, ignore_errors=True)
            collection_name = f"repo_{repo_name}".lower().replace("-", "_").strip("_-.")
            try:
                chromadb_client.delete_collection(name=collection_name)
            except Exception as e:
                pass
        except Exception as e:
            print(f"[{repo_name}] Cleanup error: {e}")
            
    return stats

def generate_report(results):
    total_repos = len(results)
    total_files = sum(r.get("total_source_files_processed", 0) for r in results)
    total_chunks = sum(r.get("total_semantic_chunks", 0) for r in results)
    successful_repos = [r for r in results if "error" not in r]
    avg_chunks_per_repo = total_chunks / max(len(successful_repos), 1)
    
    total_indexing_time = sum(r.get("total_indexing_time", 0) for r in successful_repos)
    avg_indexing_time = total_indexing_time / max(len(successful_repos), 1)
    
    all_queries = []
    for r in successful_repos:
        all_queries.extend([q for q in r.get("queries", []) if q.get("success")])
        
    avg_query_time = sum(q.get("end_to_end_time", 0) for q in all_queries) / max(len(all_queries), 1)
    avg_retrieval_latency = sum(q.get("retrieval_latency", 0) for q in all_queries) / max(len(all_queries), 1)
    avg_llm_latency = sum(q.get("llm_response_latency", 0) for q in all_queries) / max(len(all_queries), 1)
    
    all_languages = set()
    language_counts = defaultdict(int)
    for r in successful_repos:
        all_languages.update(r.get("languages", []))
        for lang in r.get("languages", []):
            language_counts[lang] += 1
            
    total_successful_queries = len(all_queries)
    max_chunks_single_repo = max((r.get("total_semantic_chunks", 0) for r in successful_repos), default=0)
    
    report = [
        "# Benchmark Summary",
        f"* Repositories Tested: {total_repos}",
        f"* Total Files Processed: {total_files}",
        f"* Total Semantic Chunks: {total_chunks}",
        f"* Average Chunks per Repository: {avg_chunks_per_repo:.2f}",
        f"* Average Indexing Time: {avg_indexing_time:.2f} seconds",
        f"* Average Query Response Time: {avg_query_time:.2f} seconds",
        f"* Programming Languages Supported: {len(all_languages)}",
        "",
        "## Repository Coverage",
        f"* Total repositories tested: {total_repos}",
        f"* Total source files processed: {total_files}",
        f"* Total semantic chunks generated: {total_chunks}",
        f"* Total embeddings stored: {total_chunks}",
        f"* Total successful queries executed: {total_successful_queries}",
        "",
        "## Language Support",
        f"* Supported programming languages: {len(all_languages)}",
        "* Repositories per language:"
    ]
    for lang, count in language_counts.items():
        report.append(f"  * {lang}: {count} repositories")
        
    report.extend(["", "## Chunking Metrics",
        f"* Total chunks generated: {total_chunks}",
        f"* Average chunks per repository: {avg_chunks_per_repo:.2f}",
        f"* Maximum chunks generated for a single repository: {max_chunks_single_repo}",
        ""
    ])
    
    report.append("## Detailed Per-Repository Statistics\n")
    
    for r in results:
        report.append(f"### {r['repository_name']}")
        if "error" in r:
            report.append(f"**Error**: {r['error']}\n")
            continue
            
        report.append(f"- URL: {r['repository_url']}")
        report.append(f"- Languages: {', '.join(r['languages'])}")
        report.append(f"- Total source files processed: {r['total_source_files_processed']}")
        report.append(f"- Files skipped: {r['files_skipped']}")
        report.append(f"- Total semantic chunks generated: {r['total_semantic_chunks']}")
        report.append(f"- Chunks per file: {r['chunks_per_file']:.2f}")
        report.append(f"- Average chunk size: {r['average_chunk_size']:.1f} characters")
        report.append(f"- Largest chunk: {r['largest_chunk']} characters")
        report.append(f"- Smallest chunk: {r['smallest_chunk']} characters")
        
        report.append(f"\n#### Indexing Metrics")
        report.append(f"- Repository cloning time: {r['cloning_time']:.2f}s")
        report.append(f"- Parsing time: {r['parsing_time']:.2f}s")
        report.append(f"- Chunk generation time: {r['chunk_generation_time']:.2f}s")
        report.append(f"- Embedding generation & ChromaDB indexing time: {r['indexing_time']:.2f}s")
        report.append(f"- Total indexing time: {r['total_indexing_time']:.2f}s")
        
        q_times = [q['end_to_end_time'] for q in r.get('queries', []) if q.get('success')]
        if q_times:
            report.append(f"\n#### Retrieval Metrics (10 queries)")
            report.append(f"- Average query latency: {sum(q_times)/len(q_times):.2f}s")
            report.append(f"- Median latency: {statistics.median(q_times):.2f}s")
            report.append(f"- Minimum latency: {min(q_times):.2f}s")
            report.append(f"- Maximum latency: {max(q_times):.2f}s")
            
        report.append("")
        
    report.append("## Resume Ready Metrics")
    report.append(f"* Tested across {total_repos} public repositories")
    report.append(f"* Processed {total_files} source files")
    report.append(f"* Generated {total_chunks} semantic code chunks")
    report.append(f"* Average repository indexing time: {avg_indexing_time:.2f} seconds")
    report.append(f"* Average semantic search latency: {avg_retrieval_latency:.2f} seconds")
    report.append(f"* Average LLM response latency: {avg_llm_latency:.2f} seconds")
    report.append(f"* Supports {len(all_languages)} programming languages")
    
    with open("benchmark_report.md", "w", encoding="utf-8") as f:
        f.write("\n".join(report))

if __name__ == "__main__":
    results = []
    print("Starting Benchmark Suite...")
    for repo in REPOSITORIES:
        stats = benchmark_repo(repo)
        results.append(stats)
        
    with open("benchmark_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=4)
        
    generate_report(results)
    print("Benchmark complete! Reports generated.")
