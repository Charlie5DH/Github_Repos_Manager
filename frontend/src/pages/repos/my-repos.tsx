"use client";

import type React from "react";
import { useState, useEffect } from "react";
import RepoTable from "./repos-table";

type Repository = {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
};

const MyRepos: React.FC = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);

  useEffect(() => {
    // In a real application, you would fetch the imported repositories from your backend
    // For this example, we'll use more mock data
    const mockRepositories: Repository[] = Array.from(
      { length: 50 },
      (_, i) => ({
        id: i + 1,
        name: `repo-${i + 1}`,
        description: `This is a description for repo-${i + 1}`,
        html_url: `https://github.com/user/repo-${i + 1}`,
        stargazers_count: Math.floor(Math.random() * 1000),
        forks_count: Math.floor(Math.random() * 500),
      })
    );

    setRepositories(mockRepositories);
  }, []);

  return (
    <div className="flex h-screen w-full">
      <div className="relative flex flex-col h-screen w-full dark:bg-grid-small-white/[0.1] bg-grid-small-black/[0.1] pb-20 px-6 items-center">
        <div className="z-10 w-full max-w-[1440px] mt-5 p-6 flex flex-col items-start">
          <h1 className="text-3xl font-bold mb-6">My Repositories</h1>
          <RepoTable repositories={repositories} />
        </div>
      </div>
    </div>
  );
};

export default MyRepos;
