import type React from "react";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useToast } from "../../hooks/use-toast";
import { Loader2, Upload } from "lucide-react";
import { GitHubRepo } from "../../types/types";
import { importRepos } from "../../api/repos";
import Papa from "papaparse";
import { AxiosError } from "axios";

interface CSVImportProps {
  onImport: (data: GitHubRepo[]) => void;
  repos: GitHubRepo[];
}

const CSVImport: React.FC<CSVImportProps> = ({ onImport, repos }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  function parseAndValidateCSV(file: File) {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const fields = results.meta.fields || [];
        if (!validateCSVHeaders(fields)) {
          toast({
            title: "Error in CSV file",
            description: "CSV file does not contain all required columns.",
            variant: "destructive",
          });
          throw new Error("CSV file does not contain all required columns");
        }
        setFile(file);
      },
    });
  }

  const validateCSVHeaders = (headers: string[]): boolean => {
    const requiredColumns: (keyof GitHubRepo)[] = [
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
    return requiredColumns.every((column) => headers.includes(column));
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (!file) {
        return;
      }
      parseAndValidateCSV(file);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a CSV file to import.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    Papa.parse(file, {
      complete: async (results) => {
        try {
          parseAndValidateCSV(file);
          const data: GitHubRepo[] = results.data as GitHubRepo[];
          const newRepos = data.filter(
            (repo) => !repos.some((r) => r.id === repo.id)
          );
          onImport(newRepos);

          // 3. Send data to backend using the imported function
          try {
            await importRepos(data);
            toast({
              title: "Success",
              description:
                "CSV data imported and sent to backend successfully.",
              variant: "success",
            });
          } catch (error: unknown) {
            console.error("Error sending data to backend:", error);
            toast({
              title: "Import error",
              description:
                (error as AxiosError<{ detail: string }>).response?.data
                  ?.detail ??
                "Repos imported to table, but failed to send to backend. Please try again later.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error importing CSV:", error);
          toast({
            title: "Error",
            description: "Failed to import CSV data. Please try again.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      },
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
      <div className="relative w-full sm:w-auto">
        <Input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="sr-only"
          id="csv-file-input"
        />
        <label
          htmlFor="csv-file-input"
          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md 
          shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
        >
          <Upload className="w-5 h-5 mr-2" />
          {file ? file.name : "Choose CSV file"}
        </label>
      </div>
      <Button
        onClick={handleImport}
        disabled={!file || loading}
        className="w-full sm:w-auto"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Importing...
          </>
        ) : (
          "Import CSV"
        )}
      </Button>
    </div>
  );
};

export default CSVImport;
