import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Eye, GitForkIcon, Star } from "lucide-react";
import { GitHubRepoFromApi } from "../../types/types";

const RepoGrid = ({ repositories }: { repositories: GitHubRepoFromApi[] }) => {
  return repositories.map((repo) => (
    <Card
      onClick={() => window.open(repo.html_url, "_blank")}
      key={repo.id}
      rel="noopener noreferrer"
      className="col-span-1 hover:shadow-md transition-shadow hover:border-muted-foreground/40 cursor-pointer"
    >
      <CardHeader>
        <CardTitle className="text-lg">{repo.name}</CardTitle>
        <CardDescription>{repo.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center text-muted-foreground gap-1">
            <Star size={16} /> {repo.stargazers_count} stars
          </span>
          <span className="flex items-center text-muted-foreground gap-1">
            <GitForkIcon size={16} /> {repo.forks_count} forks
          </span>
          <span className="flex items-center text-muted-foreground gap-1">
            <Eye size={16} /> {repo.watchers} watchers
          </span>
        </div>
      </CardContent>
    </Card>
  ));
};

export default RepoGrid;
