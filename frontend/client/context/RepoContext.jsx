import React, { createContext, useContext, useState } from "react";

const RepoContext = createContext();

export function RepoProvider({ children }) {
  const [currentRepo, setCurrentRepo] = useState(null);
  const [recentRepos, setRecentRepos] = useState([]);

  const addRepo = (repo) => {
    setRecentRepos((prev) => {
      // Avoid duplicates
      const exists = prev.find((r) => r.repo_name === repo.repo_name);
      if (exists) return prev;
      return [repo, ...prev];
    });
    setCurrentRepo(repo);
  };

  const selectRepo = (repoName) => {
    const repo = recentRepos.find((r) => r.repo_name === repoName);
    if (repo) {
      setCurrentRepo(repo);
    }
  };

  return (
    <RepoContext.Provider
      value={{ currentRepo, recentRepos, addRepo, selectRepo }}
    >
      {children}
    </RepoContext.Provider>
  );
}

export function useRepo() {
  const context = useContext(RepoContext);
  if (!context) {
    throw new Error("useRepo must be used within a RepoProvider");
  }
  return context;
}
