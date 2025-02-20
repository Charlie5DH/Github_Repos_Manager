import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Download, GitFork, LetterText, Loader2, Star } from "lucide-react";
import RepoGrid from "./repo-grid";
import { exportToCSV } from "../../lib/utils";
import { GitHubRepo, GitHubUser, SortOption } from "../../types/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "../../hooks/use-toast";
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group";

const debounce = <T extends unknown[]>(
  func: (...args: T) => void,
  delay: number
) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: T) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const GitHubSearch = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [repositories, setRepositories] = useState<GitHubRepo[]>([]);
  const [suggestions, setSuggestions] = useState<GitHubUser[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState<boolean>(false);
  const [loadingRepos, setLoadingRepos] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("stars");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    setShowSuggestions(value.length > 0);

    if (value.length > 0) {
      setLoadingSuggestions(true);
      debouncedFetchSuggestions(value);
    } else {
      setSuggestions([]);
      setLoadingSuggestions(false);
    }
  };

  const fetchSuggestions = async (query: string) => {
    try {
      const response = await fetch(
        `https://api.github.com/search/users?q=${query}&per_page=5`
      );
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Rate limit exceeded. Please try again later.");
        }
        throw new Error(`GitHub API error: ${response.status}`);
      }
      const data = await response.json();
      setSuggestions(data.items || []);
      setError(null);
    } catch (error: unknown) {
      console.error("Error fetching repositories:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to fetch user suggestions. Please try again later.",
        variant: "destructive",
      });
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const debouncedFetchSuggestions = useCallback(
    debounce(fetchSuggestions, 300),
    []
  );

  const handleSuggestionClick = (username: string) => {
    setSearchTerm(username);
    setShowSuggestions(false);
    fetchRepositories(username);
  };

  const handleSuggestionKeyDown = (
    e: React.KeyboardEvent,
    username: string
  ) => {
    if (e.key === "Enter") {
      handleSuggestionClick(username);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      fetchRepositories(searchTerm);
    } else if (event.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const fetchRepositories = async (username: string, page = 1) => {
    setLoadingRepos(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&page=${page}`
      );
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Rate limit exceeded. Please try again later.");
        }
        throw new Error(`GitHub API error: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      if (page === 1) {
        setRepositories(data);
      } else {
        setRepositories((prev) => [...prev, ...data]);
      }
      setHasMore(data.length === 100); // If we got 100 repos, there might be more
      setPage(page);
    } catch (error: unknown) {
      console.error("Error fetching repositories:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to fetch repositories. Please try again later.",
        variant: "destructive",
      });
      setRepositories([]);
    } finally {
      setLoadingRepos(false);
    }
  };

  const loadMoreRepositories = () => {
    if (hasMore && !loadingRepos) {
      fetchRepositories(searchTerm, page + 1);
    }
  };

  const sortRepositories = (repos: GitHubRepo[]): GitHubRepo[] => {
    switch (sortBy) {
      case "stars":
        return [...repos].sort(
          (a, b) => b.stargazers_count - a.stargazers_count
        );
      case "forks":
        return [...repos].sort((a, b) => b.forks_count - a.forks_count);
      case "name":
        return [...repos].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return repos;
    }
  };

  const handleSortChange = (value: string) => {
    setSortBy(value as SortOption);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="flex h-screen">
      <div className="w-full">
        <div className="relative flex flex-col h-full w-full dark:bg-grid-small-white/[0.1] bg-grid-small-black/[0.1] pb-20 px-6 items-center overflow-y-scroll">
          <div className="z-10 w-full max-w-[1440px] mt-5 p-6 flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-1 text-primary tracking-tight">
              Who&apos;s Repo are you looking for?
            </h1>
            <p className="text-sm text-muted-foreground mb-4">
              You can search for any public repository on GitHub by typing the
              username.
            </p>
            <div className="flex w-full lg:w-1/2 shadow-sm items-center gap-2">
              <div className="relative flex-grow">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search for a user..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                    className="w-full h-10 px-4"
                  />
                  {loadingSuggestions && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="absolute z-10 w-full bg-background border border-border rounded-md mt-1 shadow-lg">
                    {suggestions.map((suggestion) => (
                      <li
                        key={suggestion.login}
                        onClick={() => handleSuggestionClick(suggestion.login)}
                        onKeyDown={(e) =>
                          handleSuggestionKeyDown(e, suggestion.login)
                        }
                        className="suggestion flex items-center p-2 hover:bg-muted cursor-pointer"
                        tabIndex={0}
                      >
                        <img
                          src={suggestion.avatar_url || "/placeholder.svg"}
                          alt={suggestion.login}
                          className="w-6 h-6 rounded-full mr-2"
                        />
                        <span className="text-sm">{suggestion.login}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <Button
                onClick={() => exportToCSV(repositories)}
                variant="default"
                disabled={repositories.length === 0}
              >
                Export to CSV <Download />
              </Button>
            </div>
          </div>

          {error && (
            <p className="text-center text-destructive mb-4">{error}</p>
          )}

          {repositories.length > 0 && (
            <div className="flex items-center justify-end w-full max-w-3xl mx-auto mb-6">
              <ToggleGroup
                variant="outline"
                type="single"
                value={sortBy}
                onValueChange={handleSortChange}
              >
                <ToggleGroupItem
                  value="stars"
                  size="sm"
                  className="bg-white text-secondary-foreground/80"
                >
                  <Star /> Stars
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="forks"
                  size="sm"
                  className="bg-white text-secondary-foreground/80"
                >
                  <GitFork /> Forks
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="name"
                  size="sm"
                  className="bg-white text-secondary-foreground/80"
                >
                  <LetterText /> Name
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          )}

          {loadingRepos ? (
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p className="text-muted-foreground mt-2">
                Loading repositories...
              </p>
            </div>
          ) : repositories.length > 0 ? (
            <>
              <div className="z-10 w-full max-w-[1440px] grid grid-flow-row md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-6 mt-5">
                <RepoGrid repositories={sortRepositories(repositories)} />
              </div>
              {hasMore && (
                <div className="text-center mt-8">
                  <Button
                    onClick={loadMoreRepositories}
                    disabled={loadingRepos}
                  >
                    {loadingRepos ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Load More"
                    )}
                  </Button>
                </div>
              )}
            </>
          ) : searchTerm.length > 2 && suggestions.length > 0 ? (
            <p className="text-center text-muted-foreground text-sm font-medium">
              No repositories found. Try searching for a GitHub username.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default GitHubSearch;
