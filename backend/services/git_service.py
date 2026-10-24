from git import Repo
from git.exc import GitCommandError
import os

REPO_FOLDER = "repos"

def clone_repoository(repo_url:str):
    try:
        repo_name=repo_url.rstrip("/").split("/")[-1]

        local_path= os.path.join(
            "repos",
            repo_name
        )
        if not os.path.exists(local_path):
            Repo.clone_from(
                repo_url,
                local_path
            )
        return {
            "repo_name":repo_name,
            "local_path":local_path
        }
    
    except GitCommandError as e:
        return {
            "success": False,
            "error": str(e)
        }

