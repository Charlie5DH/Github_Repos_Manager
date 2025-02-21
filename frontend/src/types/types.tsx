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
  login: string;
  avatar_url: string;
  watchers: string;
}

export interface GitHubRepoFromApi {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  owner: GitHubUser;
  avatar_url: string;
  watchers: number;
}

export interface NotificationData {
  id: string;
  message: string;
  timestamp: string; // or Date, if you parse it
}

export type SortOption = "stars" | "forks" | "name";
