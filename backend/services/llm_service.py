import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from services.vector_store_service import (
    search_repository
)

load_dotenv()

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0
)

def infer_role(path):
    path = path.lower()

    if "routes" in path:
        return "API Route"

    if "models" in path:
        return "Database Model"

    if "controllers" in path:
        return "Controller"

    if "components" in path:
        return "Frontend Component"

    if "services" in path:
        return "Service"

    if "readme" in path:
        return "Project Documentation"

    return "Source File"

def format_context(results):
    docs = results["documents"][0]
    metas = results["metadatas"][0]
    distances = results["distances"][0]

    sections = []

    for rank, (doc, meta, distance) in enumerate(
        zip(docs, metas, distances),
        start=1
    ):

        sections.append(
            f"""
### RETRIEVED CHUNK {rank}

FILE: {meta['filename']}
PATH: {meta['path']}
ROLE: {infer_role(meta['path'])}
RELEVANCE: {distance:.3f}

CODE:
{doc}

----------------------------------------
"""
        )

    return "\n".join(sections)

def ask_repository(
        repo_name,
        query):
    
    results=search_repository(repo_name,query)
    context=format_context(results)

    prompt = f"""
You are an expert software architect and senior code reviewer.

Your task is to answer questions ONLY using the provided repository context.

Rules:

1. NEVER invent information that is not present in the context.
2. If the answer cannot be determined from the context, explicitly say:
   "The repository context does not contain enough information to answer this."
3. Prefer concrete implementation details over assumptions.
4. Reference file names whenever possible.
5. When multiple files contribute to an answer, explain how they interact.
6. Be concise but technically accurate.

For code-related questions:

- Explain the purpose of the code.
- Mention important functions, classes, routes, APIs, and models.
- Mention relationships between components.
- Mention data flow when relevant.

For schema/model questions:

- List all fields.
- Mention field types.
- Mention defaults.
- Mention validation rules.
- Mention required constraints.
- Mention references/relationships.

For architecture questions:

- Explain frontend, backend, database, and external services separately.
- Describe request flow step-by-step.
- Mention important dependencies.

For API questions:

- Mention endpoint.
- HTTP method.
- Request parameters.
- Request body.
- Response format.
- Related files.

Question:
{query}

Repository Context:
{context}



Answer:
"""
    

    response = llm.invoke(prompt)

    sources = []

    seen = set()

    for meta in results["metadatas"][0]:

        path = meta["path"]

        if path not in seen:

            sources.append({
                "file": path
            })

            seen.add(path)

    print(results["metadatas"][0])    
    return {
        "answer": response.content,
        "sources": sources
    }