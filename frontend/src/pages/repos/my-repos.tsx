import type React from "react";
import { useState, useEffect } from "react";
import RepoTable from "./repos-table";
import { GitHubRepo } from "../../types/types";
import CSVImport from "./csv-importer";
import { deleteAllRepos, fetchRepositories } from "../../api/repos";
import { useToast } from "../../hooks/use-toast";
import { Button } from "../../components/ui/button";
import { Trash2 } from "lucide-react";

const MyRepos: React.FC = () => {
  const [repositories, setRepositories] = useState<GitHubRepo[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // fetch the imported repositories from your backend
    fetchRepositories()
      .then((repos) => {
        setRepositories(repos);
      })
      .catch((err) => {
        console.error("Error fetching repos:", err);
      });
  }, []);

  const handleImport = (data: GitHubRepo[]) => {
    setRepositories((prevRepos) => [...data, ...prevRepos]);
  };

  const handleDeleteAllRepos = async () => {
    try {
      const result = await deleteAllRepos();
      if (result) {
        setRepositories([]);
        toast({
          title: "Repositories deleted",
          description: "All repositories have been deleted",
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: "Error deleting repositories",
        description: "An error occurred while deleting repositories",
        variant: "warning",
      });
      console.error("Error deleting repositories:", error);
    }
  };

  return (
    <div className="flex h-screen w-full">
      <div className="relative flex flex-col h-screen w-full dark:bg-grid-small-white/[0.1] bg-grid-small-black/[0.1] pb-20 px-6 items-center">
        <div className="z-10 w-full max-w-[1440px] mt-5 p-6 flex flex-col items-start">
          <div className="flex items-center justify-between w-full mb-6">
            <CSVImport onImport={handleImport} repos={repositories} />
            <Button
              onClick={handleDeleteAllRepos}
              variant="ghost"
              disabled={repositories.length === 0}
              className="flex items-center border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          {repositories.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full h-full mt-10">
              <h1 className="text-4xl font-bold mb-2 text-primary tracking-tight">
                No Repositories imported yet
              </h1>
              <p className="text-sm text-muted-foreground mb-4 max-w-[400px] text-center leading-normal">
                Select a CSV file with repositories and click the button above
                to import them. New repositories will be added to the top of the
                list.
              </p>
            </div>
          ) : (
            <RepoTable repositories={repositories} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRepos;
