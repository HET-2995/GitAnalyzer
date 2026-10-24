import os

from services.parser_service import read_repository_files
from services.vector_store_service import (
    get_collection,
    search_repository
)

IMPORTANT_METADATA_FILES = {
    "README",
    "README.md",
    "LICENSE",
    ".gitignore",
    ".editorconfig",

    ".env.example",

    "package.json",

    "requirements.txt",
    "pyproject.toml",

    "Cargo.toml",
    "go.mod",

    "pom.xml",
    "build.gradle",

    "Dockerfile",
    "docker-compose.yml",

    "Makefile"
}

ENTRY_POINT_PATTERNS = {
    "main",
    "app",
    "manage",
    "server",
    "index",
    "api",
    "__main__",

    "application",

    "manage",

    "run",

    "startup",

    "bootstrap"
}

# ==========================================================

def _is_entry_file(filename: str):

    name = os.path.splitext(filename)[0].lower()

    return name in ENTRY_POINT_PATTERNS

def normalize_path(path: str) -> str:
    return path.replace("\\", "/")

def _get_repository_documents(repo_name: str):

    repo_path = f"repos/{repo_name}"

    return read_repository_files(repo_path)



def _get_important_context(repo_name: str):

    docs = _get_repository_documents(repo_name)

    context = []
    sources = []

    for doc in docs:

        filename = os.path.basename(doc["path"])

        path = normalize_path(
    doc["path"]
)

        # Ignore nested READMEs
        if (
            filename == "README.md"
            and path != "README.md"
        ):
            continue

        if (
            filename in IMPORTANT_METADATA_FILES
            or _is_entry_file(filename)
        ):

            context.append(
                f"""
==================================================
File: {filename}
Path: {path}
==================================================

{doc["content"]}

--------------------------------------------------
"""
            )
            sources.append({
    "file": path,
    "filename": filename,
    "chunk_type": "important_file"
})

    return {
    "context": "\n".join(context),
    "sources": sources
}


def _get_directory_structure(repo_name):

    repo_path = f"repos/{repo_name}"

    tree = []

    for root, dirs, files in os.walk(repo_path):

        dirs[:] = [
            d for d in dirs
            if d not in {
                ".git",
                "node_modules",
                "__pycache__",
                ".venv",
                "venv"
            }
        ]

        level = root.replace(repo_path, "").count(os.sep)

        indent = "    " * level

        folder = os.path.basename(root)

        if folder:

            tree.append(f"{indent}{folder}/")

        file_indent = "    " * (level + 1)

        for file in sorted(files):

            tree.append(f"{file_indent}{file}")

    return "\n".join(tree)


def _detect_components(repo_name):

    docs = _get_repository_documents(repo_name)

    components = {
        "Routes": [],
        "Models": [],
        "Controllers": [],
        "Services": [],
        "Frontend Components": [],
        "Utilities": [],
        "Configuration": []
    }

    for doc in docs:

        path = normalize_path(doc["path"])

        filename = os.path.basename(path)

        lower = path.lower()

        if "/routes/" in lower:
            components["Routes"].append(filename)

        elif "/models/" in lower:
            components["Models"].append(filename)

        elif "/controllers/" in lower:
            components["Controllers"].append(filename)

        elif "/services/" in lower:
            components["Services"].append(filename)

        elif "/utils/" in lower:
            components["Utilities"].append(filename)

        elif filename.endswith(".jsx") or filename.endswith(".tsx"):
            components["Frontend Components"].append(filename)

        elif filename in IMPORTANT_METADATA_FILES:
            components["Configuration"].append(filename)

    output = []

    for category, files in components.items():

        if not files:
            continue

        output.append(f"{category}:")

        for file in sorted(set(files)):
            output.append(f"  - {file}")

        output.append("")

    return "\n".join(output)

def _get_repository_metadata(repo_name: str):

    docs = _get_repository_documents(repo_name)

    languages = set()

    total_files = len(docs)

    entry_points = []

    for doc in docs:

        filename = os.path.basename(doc["path"])

        ext = os.path.splitext(filename)[1]

        if ext:
            languages.add(ext)

        if _is_entry_file(filename):
            entry_points.append(
                normalize_path(doc["path"])
            )

    metadata = f"""
Repository Name: {repo_name}

Total Files: {total_files}

Detected File Types:
{", ".join(sorted(languages))}

Entry Points:
"""

    if entry_points:

        for file in entry_points:

            metadata += f"\n- {file}"

    else:

        metadata += "\nNone"

    return metadata

def _calculate_top_k(repo_name):

    collection = get_collection(repo_name)

    total_chunks = collection.count()

    top_k = max(8, total_chunks // 8)

    top_k = min(top_k, 30)

    return top_k


# ==========================================================
# SEMANTIC SEARCH
# ==========================================================

def _semantic_queries(intent, question):

    if intent == "SUMMARY":

        return [
            "backend routes api endpoints",
            "database schema models",
            "frontend components state",
            "services business logic",
            "utilities helper functions"
        ]

    elif intent == "ARCHITECTURE":

        return [
    "application entry point",
    "server startup",
    "frontend root component",
    "api routes",
    "database models",
    "services",
    "request flow",
    "folder structure"
]

    elif intent == "BUG_ANALYSIS":

        return [
            question,
            "error handling",
            "security validation",
            "edge cases"
        ]

    elif intent == "IMPROVEMENTS":

        return [
            question,
            "performance optimization",
            "refactoring",
            "best practices"
        ]
    
    elif intent == "DOCUMENTATION":

        return [

        "repository overview",

        "backend routes",

        "database models",

        "frontend components",

        "application workflow",

        "api endpoints",

        "services",

        "utilities",

        "configuration files",

        "business logic"
    ]

    else:
        # QA

        return [question]


def _get_semantic_context(
    repo_name,
    intent,
    question
):
    top_k = _calculate_top_k(repo_name)

    queries = _semantic_queries(
        intent,
        question
    )

    chunks = []
    sources = []

    seen_chunks = set()
    seen_sources = set()

    for query in queries:

        results = search_repository(
            repo_name=repo_name,
            query=query,
            top_k=top_k
        )

        documents = results["documents"][0]
        metadatas = results["metadatas"][0]

        for doc, meta in zip(documents, metadatas):
            path = normalize_path(
    meta["path"]
)
            chunk_key = (
                meta["path"],
                doc
            )

            if chunk_key not in seen_chunks:

                if len(chunks) >= 20:
                    break

                seen_chunks.add(chunk_key)

                chunks.append(
                    f"""
==================================================
File: {meta['path']}
Chunk Type: {meta['chunk_type']}
==================================================

{doc}

--------------------------------------------------
"""
                )

            if meta["path"] not in seen_sources:

                seen_sources.add(
                    path
                )

                sources.append({
                    "file": path,
                    "filename": meta["filename"],
                    "chunk_type": meta["chunk_type"]
                })

        if len(chunks) >= 20:
            break

    return {
        "context": "\n".join(chunks),
        "sources": sources
    }


# ==========================================================
# PUBLIC API
# ==========================================================

def build_context(
    repo_name,
    intent,
    question
):
    """
    Builds repository context according to the
    requested intent.
    """

    important = _get_important_context(
        repo_name
    )

    semantic = _get_semantic_context(
        repo_name,
        intent,
        question
    )

    # Merge sources
    sources = []
    seen = set()

    for source in (
        important["sources"] +
        semantic["sources"]
    ):
        if source["file"] not in seen:
            seen.add(source["file"])
            sources.append(source)

    if intent == "SUMMARY":

        context = f"""
================ IMPORTANT FILES ================

{important["context"]}

================ IMPLEMENTATION ================

{semantic["context"]}
"""

    elif intent == "ARCHITECTURE":

        context = f"""
================ ENTRY POINTS ================

{important["context"]}

================ IMPLEMENTATION ================

{semantic["context"]}
"""
        
    elif intent == "DOCUMENTATION":

        metadata = _get_repository_metadata(
            repo_name
        )

        structure = _get_directory_structure(
            repo_name
        )

        components = _detect_components(
            repo_name
        )

        context = f"""
    ================ REPOSITORY METADATA ================

    {metadata}

    ================ PROJECT STRUCTURE ================

    {structure}

    ================ DETECTED COMPONENTS ================

    {components}

    ================ IMPORTANT FILES ================

    {important["context"]}

    ================ IMPLEMENTATION DETAILS ================

    {semantic["context"]}
    """

    else:
        # QA, BUG_ANALYSIS, IMPROVEMENTS
        context = semantic["context"]

    return {
        "context": context,
        "sources": sources
    }