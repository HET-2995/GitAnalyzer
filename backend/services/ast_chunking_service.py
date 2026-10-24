import ast
import os
import uuid

def extract_python_ast_chunks(file_path, content=None):
    try:
        filename = os.path.basename(file_path)
        if content is not None:
            source_code = content
        else:
            with open(
                file_path,
                "r",
                encoding="utf-8",
                errors="ignore"
            ) as f:
                source_code=f.read()
        
        tree=ast.parse(source_code)

        chunks = []

        for node in tree.body:

            if isinstance(
                node,
                ast.FunctionDef
            ):
                chunks.append({
                "chunk_id": str(uuid.uuid4()),
                "path": file_path,
                "filename": filename,
                "extension": ".py",

                "chunk_type": "function",
                "symbol_name": node.name,

                "content": ast.get_source_segment(
                    source_code,
                    node
                )
            })

            elif isinstance(
                node,
                ast.ClassDef
            ):

                chunks.append({
                    "chunk_id": str(uuid.uuid4()),
                    "path": file_path,
                    "filename": filename,
                    "extension": ".py",

                    "chunk_type": "class",
                    "symbol_name": node.name,

                    "content": ast.get_source_segment(
                        source_code,
                        node
                    )
                })
            
        return chunks
    except Exception:
        return []

