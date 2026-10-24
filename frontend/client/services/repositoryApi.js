import api from "./api";


export const cloneRepository = (repoUrl) =>
    api.post("/repositories", null, {
        params: {
            repo_url: repoUrl,
        },
    });

export const indexRepository = (repoName) =>
    api.post(`/repos/${repoName}/index`);

export const analyzeRepository = (repoName, question) =>
    api.post(`/repos/${repoName}/analyze`, {
        question,
    });