import chromadb
from sentence_transformers import SentenceTransformer

client = chromadb.PersistentClient(
    path="./chroma_db"
)



embedding_model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)



def get_collection(repo_name):
    collection_name = (
        f"repo_{repo_name}"
        .lower()
        .replace("-", "_")
        .strip("_-.")
    )
    return client.get_or_create_collection(
        name=collection_name
    )

def index_chunks(
    repo_name,
    chunks
):
    collection = get_collection(
        repo_name
    )
    documents = []
    metadatas = []
    ids = []
    embeddings = []

    for chunk in chunks:
        documents.append(chunk["content"])
        metadatas.append({
            "path": chunk["path"],
            "filename": chunk["filename"],
            "extension": chunk["extension"],
            "chunk_type": chunk["chunk_type"],
            "symbol_name": str(chunk["symbol_name"])
        })
        ids.append(chunk["chunk_id"])

    try:
        print(f"Generating embeddings for {len(documents)} chunks...")
        # Batch encode all documents at once for massive speedup
        embeddings = embedding_model.encode(documents, batch_size=128, show_progress_bar=True).tolist()
        
        print(f"Indexing {len(documents)} chunks into {collection.name}")
        
        # ChromaDB has a max batch size (e.g., 5461). We chunk the insertion.
        batch_size = 5000
        for i in range(0, len(documents), batch_size):
            end_idx = i + batch_size
            collection.add(
                documents=documents[i:end_idx],
                embeddings=embeddings[i:end_idx],
                metadatas=metadatas[i:end_idx],
                ids=ids[i:end_idx]
            )
            print(f"Indexed batch {i} to {min(end_idx, len(documents))}")
            
    except Exception as e:
        print("Indexing Error:", e)
        raise e



def search_repository(
    repo_name,
    query,
    top_k=5
):
    collection = get_collection(
        repo_name
    )

    results = collection.query(
        query_texts=[query],
        n_results=top_k
    )

    return results