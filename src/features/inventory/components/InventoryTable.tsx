import { useState, useRef, useEffect } from "react";
import {
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  TrendingUp,
} from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

import { useGetInventoryListQuery } from "../api/inventoryApi";
import type { InventoryListItemDto } from "../types";
import StockStatusBadge from "./StockStatusBadge";

import { Button } from "@shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shared/ui/dropdown-menu";
import { Input } from "@shared/ui/input";
import { Skeleton } from "@shared/ui/skeleton";
import { cn } from "@shared/lib/utils";

const PAGE_SIZE = 20;

const STOCK_TABS = [
  { value: "", label: "All" },
  { value: "inStock", label: "In Stock" },
  { value: "lowStock", label: "Low Stock" },
  { value: "outOfStock", label: "Out of Stock" },
] as const;

function parseOptions(optionsJson?: string): string {
  if (!optionsJson) return "—";
  try {
    const obj = JSON.parse(optionsJson) as Record<string, string>;
    return Object.entries(obj)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");
  } catch {
    return optionsJson;
  }
}

interface Props {
  onViewDetails: (item: InventoryListItemDto) => void;
  onCreateAdjustment: (item: InventoryListItemDto) => void;
  onLastUpdated?: (updatedAt: string) => void;
}

export default function InventoryTable({
  onViewDetails,
  onCreateAdjustment,
  onLastUpdated,
}: Props) {
  const [page, setPage] = useState(1);
  const [stockStatusFilter, setStockStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastUpdatedNotified = useRef<string | null>(null);

  const { data, isLoading, isFetching } = useGetInventoryListQuery({
    page,
    pageSize: PAGE_SIZE,
    search: appliedSearch || undefined,
    stockStatus: stockStatusFilter || undefined,
  });

  useEffect(() => {
    const latest = data?.items?.[0]?.updatedAt;
    if (latest && latest !== lastUpdatedNotified.current) {
      lastUpdatedNotified.current = latest;
      onLastUpdated?.(latest);
    }
  }, [data, onLastUpdated]);

  function handleSearchChange(value: string) {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setAppliedSearch(value);
      setPage(1);
    }, 400);
  }

  function handleStatusChange(value: string) {
    setStockStatusFilter(value);
    setPage(1);
  }

  const columns: ColumnDef<InventoryListItemDto>[] = [
    {
      accessorKey: "sku",
      header: "SKU",
      cell: ({ row }) => (
        <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded whitespace-nowrap">
          {row.original.sku}
        </span>
      ),
    },
    {
      accessorKey: "productTitle",
      header: "Product / Variant",
      cell: ({ row }) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-sm">
            {row.original.productTitle}
          </p>
          {row.original.options && (
            <p className="truncate text-xs text-muted-foreground mt-0.5">
              {parseOptions(row.original.options)}
            </p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "onHand",
      header: "On Hand",
      cell: ({ row }) => (
        <span className="text-sm font-medium tabular-nums">
          {row.original.onHand}
        </span>
      ),
    },
    {
      accessorKey: "available",
      header: "Available",
      cell: ({ row }) => (
        <span
          className={cn(
            "text-sm font-semibold tabular-nums",
            row.original.available === 0
              ? "text-red-600 dark:text-red-400"
              : row.original.available <= 5
                ? "text-amber-600 dark:text-amber-400"
                : "text-green-600 dark:text-green-400",
          )}
        >
          {row.original.available}
        </span>
      ),
    },
    {
      accessorKey: "stockStatus",
      header: "Status",
      cell: ({ row }) => <StockStatusBadge status={row.original.stockStatus} />,
    },
    {
      accessorKey: "updatedAt",
      header: "Last Synced",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {new Date(row.original.updatedAt).toLocaleString()}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      size: 48,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewDetails(row.original)}>
              <SlidersHorizontal className="mr-2 h-3.5 w-3.5" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onCreateAdjustment(row.original)}>
              <TrendingUp className="mr-2 h-3.5 w-3.5" />
              Adjust Stock
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data: data?.items ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
    manualSorting: true,
    manualPagination: true,
    pageCount: data?.totalPages ?? 1,
  });

  const totalCount = data?.totalCount ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const from = totalCount === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, totalCount);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Stock status tabs */}
        <div className="flex gap-1 rounded-lg border bg-muted/40 p-1 w-fit">
          {STOCK_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => handleStatusChange(tab.value)}
              className={cn(
                "rounded-md px-3 py-1 text-sm font-medium transition-colors",
                stockStatusFilter === tab.value
                  ? "bg-background shadow text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <Input
          placeholder="Search by SKU or product…"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-t">
                  {columns.map((_, ci) => (
                    <td key={ci} className="px-4 py-3">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-sm text-muted-foreground"
                >
                  {appliedSearch || stockStatusFilter
                    ? "No inventory items match your filters."
                    : "No inventory items found."}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    "border-t transition-colors hover:bg-muted/30",
                    isFetching && "opacity-60",
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalCount > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {from}–{to} of {totalCount} items
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isFetching}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 py-1 text-sm font-medium">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || isFetching}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
