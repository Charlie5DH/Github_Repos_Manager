import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { GitHubRepoFromApi } from "../types/types";
import Papa from "papaparse";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const exportToCSV = (repositories: GitHubRepoFromApi[]) => {
  if (repositories.length === 0) {
    return;
  }

  const headers = [
    "id",
    "name",
    "description",
    "stargazers_count",
    "forks_count",
    "html_url",
    "login",
    "avatar_url",
    "watchers",
  ];
  const data = repositories.map((repo) => ({
    id: repo.id,
    name: repo.name,
    description: repo.description || "",
    stargazers_count: repo.stargazers_count,
    forks_count: repo.forks_count,
    html_url: repo.html_url,
    login: repo.owner.login,
    avatar_url: repo.owner.avatar_url,
    watchers: repo.watchers,
  }));

  const csv = Papa.unparse(
    {
      fields: headers,
      data: data,
    },
    {
      quotes: true,
      quoteChar: '"',
      escapeChar: '"',
    }
  );

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "github_repositories.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
