import type React from "react";
import { useState, useEffect } from "react";
import RepoTable from "./repos-table";
import { GitHubRepo } from "../../types/types";
import CSVImport from "./csv-importer";

const MyRepos: React.FC = () => {
  const [repositories, setRepositories] = useState<GitHubRepo[]>([]);

  useEffect(() => {
    // In a real application, you would fetch the imported repositories from your backend
    // For this example, we'll use more mock data
    // setRepositories(mockRepositories);
  }, []);

  const handleImport = (data: GitHubRepo[]) => {
    setRepositories((prevRepos) => [...data, ...prevRepos]);
  };

  console.log(repositories);

  return (
    <div className="flex h-screen w-full">
      <div className="relative flex flex-col h-screen w-full dark:bg-grid-small-white/[0.1] bg-grid-small-black/[0.1] pb-20 px-6 items-center">
        <div className="z-10 w-full max-w-[1440px] mt-5 p-6 flex flex-col items-start">
          <div className="flex items-center justify-end w-full">
            <CSVImport onImport={handleImport} />
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
