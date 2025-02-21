import type React from "react";
import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnFiltersState,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Star,
  GitFork,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Eye,
} from "lucide-react";
import { GitHubRepo } from "../../types/types";
import { Input } from "../../components/ui/input";

type RepoTableProps = {
  repositories: GitHubRepo[];
};

const columnHelper = createColumnHelper<GitHubRepo>();

const RepoTable: React.FC<RepoTableProps> = ({ repositories }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = [
    columnHelper.accessor("name", {
      header: ({ column }) => {
        return (
          <div
            className="flex items-center cursor-pointer gap-1 hover:text-primary transition-colors duration-200 "
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        );
      },
      cell: (info) => (
        <a
          href={info.row.original.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {info.getValue()}
        </a>
      ),
    }),
    columnHelper.accessor("login", {
      header: "Username",
      cell: (info) => (
        <div
          className="max-w-[300px] truncate text-muted-foreground"
          title={info.getValue()}
        >
          {info.getValue().includes("http")
            ? info.row.original.avatar_url
            : info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor("description", {
      header: "Description",
      cell: (info) => (
        <div
          className="max-w-[300px] truncate text-muted-foreground"
          title={info.getValue()}
        >
          {info.getValue() || "No description available."}
        </div>
      ),
    }),
    columnHelper.accessor("stargazers_count", {
      header: ({ column }) => {
        return (
          <div
            className="flex items-center cursor-pointer gap-2 hover:text-primary transition-colors duration-200"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Stars
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        );
      },
      cell: (info) => (
        <div className="flex items-center">
          <Star className="w-4 h-4 mr-1 text-muted-foreground" />
          <span className="text-muted-foreground">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor("forks_count", {
      header: ({ column }) => {
        return (
          <div
            className="flex items-center cursor-pointer gap-2 hover:text-primary transition-colors duration-200"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Forks
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        );
      },
      cell: (info) => (
        <div className="flex items-center">
          <GitFork className="w-4 h-4 mr-1 text-muted-foreground" />
          <span className="text-muted-foreground">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor("watchers", {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Watchers
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: (info) => (
        <div className="flex items-center text-muted-foreground">
          <Eye className="w-4 h-4 mr-1" />
          <span>{info?.getValue() || 0}</span>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: repositories,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filter repositories..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(String(event.target.value))}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border bg-white w-full shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="h-8"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
          <span className="flex items-center gap-1 text-sm">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
};

export default RepoTable;
