// Use local Python server during development, otherwise use Hugging Face
const BASE_URL = import.meta.env.DEV 
  ? "http://127.0.0.1:8000" 
  : "https://atharv1107-git-analyzer-backend.hf.space";

export const api = {
  cloneRepo: async (repoUrl) => {
    const response = await fetch(`${BASE_URL}/repositories?repo_url=${encodeURIComponent(repoUrl)}`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("Failed to clone repository");
    return response.json();
  },

  getRepoStats: async (repoName) => {
    const response = await fetch(`${BASE_URL}/repos/${repoName}/stats`);
    if (!response.ok) throw new Error("Failed to fetch repo stats");
    return response.json();
  },

  indexRepo: async (repoName) => {
    const response = await fetch(`${BASE_URL}/repos/${repoName}/index`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("Failed to index repository");
    return response.json();
  },

  analyzeRepo: async (repoName, question) => {
    const response = await fetch(`${BASE_URL}/repos/${repoName}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });
    if (!response.ok) throw new Error("Failed to analyze repository");
    return response.json();
  }
};
