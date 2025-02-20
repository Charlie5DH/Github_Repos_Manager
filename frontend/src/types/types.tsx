export interface RepoType {
  username: string;
  repo_name: string;
  stars: number;
  forks: number;
  description: string;
}

export interface GitHubUser {
  login: string;
  avatar_url: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  watchers: number;
}

export type SortOption = "stars" | "forks" | "name";
