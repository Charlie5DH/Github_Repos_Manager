import type React from "react";
import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
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
import { Star, GitFork, ChevronLeft, ChevronRight } from "lucide-react";

type Repository = {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
};

type RepoTableProps = {
  repositories: Repository[];
};

const columnHelper = createColumnHelper<Repository>();

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
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
  columnHelper.accessor("description", {
    header: "Description",
    cell: (info) => (
      <span className="text-sm text-muted-foreground">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("stargazers_count", {
    header: "Stars",
    cell: (info) => (
      <div className="flex items-center">
        <Star className="w-4 h-4 mr-1 text-muted-foreground" />
        <span>{info.getValue()}</span>
      </div>
    ),
  }),
  columnHelper.accessor("forks_count", {
    header: "Forks",
    cell: (info) => (
      <div className="flex items-center">
        <GitFork className="w-4 h-4 mr-1 text-muted-foreground" />
        <span>{info.getValue()}</span>
      </div>
    ),
  }),
];

const RepoTable: React.FC<RepoTableProps> = ({ repositories }) => {
  const [pageSize, setPageSize] = useState(10);

  const table = useReactTable({
    data: repositories,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  return (
    <div className="space-y-4 w-full bg-white shadow-sm">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="font-bold text-muted-foreground"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-muted/50">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value));
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
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
