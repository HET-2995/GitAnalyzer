import uuid
import os
from langchain_text_splitters import RecursiveCharacterTextSplitter
from services.ast_chunking_service import extract_python_ast_chunks

splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)

def recursive_chunk_document(doc):

    chunks = []

    split_chunks = splitter.split_text(
        doc["content"]
    )
    filename=os.path.basename(doc["path"])
    extension = os.path.splitext(
        filename
    )[1]

    for chunk in split_chunks:

        chunks.append({
                "chunk_id": str(uuid.uuid4()),
                "path": doc["path"],
                "filename": filename,
                "extension": extension,

                "chunk_type": "text",
                "symbol_name": None,

                "content": chunk
            })

    return chunks

def chunk_documents(documents):

    all_chunks = []

    for doc in documents:

        extension = os.path.splitext(
            doc["path"]
        )[1].lower()

        if extension == ".py":

            ast_chunks = extract_python_ast_chunks(
                doc["path"],
                content=doc.get("content")
            )

            if ast_chunks:

                all_chunks.extend(
                    ast_chunks
                )

            else:

                all_chunks.extend(
                    recursive_chunk_document(
                        doc
                    )
                )

        else:

            all_chunks.extend(
                recursive_chunk_document(
                    doc
                )
            )

    return all_chunks