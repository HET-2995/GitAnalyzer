import os

IGNORED_DIRS = {
    ".git",
    "node_modules",
    "venv",
    ".venv",
    "__pycache__",
    "dist",
    "build",
    ".next",
    "target",
    "coverage",
    ".idea",
    ".vscode",
    ".parcel-cache"
}

IGNORED_FILENAMES = {
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml"
}

IGNORED_EXTENSIONS = {
    ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg",
    ".mp4", ".avi", ".mov", ".mkv",
    ".mp3", ".wav", ".flac",
    ".zip", ".tar", ".gz", ".rar",
    ".exe", ".dll", ".so", ".bin",
    ".pdf", ".pptx", ".docx",
    ".ttf", ".woff", ".woff2"
}

ALLOWED_EXTENSIONS = {
    ".py", ".js", ".jsx", ".ts", ".tsx",
    ".java", ".go", ".rs", ".cpp", ".c",
    ".cs", ".php", ".rb", ".swift",
    ".kt", ".scala",

    ".json", ".yaml", ".yml",
    ".toml", ".xml", ".ini",

    ".md", ".txt",

    ".sql",

    ".sh", ".bat"
}

IMPORTANT_FILENAMES = {
    "Dockerfile",
    "Makefile",
    "README",
    "README.md",
    "LICENSE",
    ".env.example",
    "requirements.txt",
    "package.json",
    "Cargo.toml",
    "go.mod",
    "pom.xml",
    "build.gradle"
}

MAX_FILE_SIZE = 2 * 1024 * 1024  # 2 MB

def is_text_file(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            f.read(1024)

        return True

    except (UnicodeDecodeError, OSError):
        return False


def should_include_file(file_path):
    filename = os.path.basename(file_path)
    ext = os.path.splitext(file_path)[1].lower()

    if filename in IGNORED_FILENAMES:
        return False

    if ext in IGNORED_EXTENSIONS:
        return False

    if file_path.endswith(".map") or file_path.endswith(".min.js") or file_path.endswith(".min.css"):
        return False

    try:
        if os.path.getsize(file_path) > MAX_FILE_SIZE:
            return False
    except OSError:
        return False

    if filename in IMPORTANT_FILENAMES:
        return True

    if ext in ALLOWED_EXTENSIONS:
        return True

    return is_text_file(file_path)


def get_repository_files(repo_path):
    collected_files = []

    for root, dirs, files in os.walk(repo_path):

        dirs[:] = [
            d
            for d in dirs
            if d not in IGNORED_DIRS
        ]

        for file in files:
            full_path = os.path.join(root, file)

            if should_include_file(full_path):
                collected_files.append(full_path)

    return collected_files


def read_repository_files(repo_path):
    file_paths = get_repository_files(repo_path)

    documents = []

    for path in file_paths:
        try:
            with open(
                path,
                "r",
                encoding="utf-8"
            ) as f:

                content = f.read()

                documents.append({
                    "path": os.path.relpath(path, repo_path),
                    "content": content
                })

        except (UnicodeDecodeError, OSError):
            continue

    return documents