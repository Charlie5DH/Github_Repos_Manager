import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { GitHubRepo } from "../types/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const exportToCSV = (repositories: GitHubRepo[]) => {
  if (repositories.length === 0) {
    return;
  }

  const headers = Object.keys(repositories[0]).join(",");
  const rows = repositories
    .map((repo) => Object.values(repo).join(","))
    .join("\n");
  const csvContent = `${headers}\n${rows}`;

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "github_repositories.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
