import axios from "axios";
import { GitHubRepo } from "../types/types";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function importRepos(data: GitHubRepo[]) {
  const response = await axios.post(`${baseURL}/api/import-repos`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
}

export async function fetchRepositories(): Promise<GitHubRepo[]> {
  const res = await axios.get(`${baseURL}/api/repositories`);
  return res.data;
}

export async function deleteAllRepos() {
  const res = await axios.delete(`${baseURL}/api/repositories`);
  return res.data; // { detail: "All repositories have been deleted." }
}
