import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ImageOff,
  Pencil,
  MoreHorizontal,
  ArchiveRestore,
  XCircle,
  CirclePlay,
  ChevronLeft,
  ChevronRight,
  CheckSquare2,
  X,
} from "lucide-react";
import type { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

import {
  useAdminGetProductsQuery,
  useAdminChangeProductStatusMutation,
  useAdminBulkChangeProductStatusMutation,
} from "@features/catalog/api/catalogApi";
import type { AdminProductListItemDto, ProductStatus } from "../types";
import ProductStatusBadge from "./ProductStatusBadge";

import { Button } from "@shared/ui/button";
import { Checkbox } from "@shared/ui/checkbox";
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

// ── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 20;

const STATUS_TABS = [
  { value: "", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
] as const;

// ── Component ─────────────────────────────────────────────────────────────────

export default function ProductsTable() {
  const navigate = useNavigate();

  // ── Server-side state (drives the API call) ────────────────────────────────
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [search, setSearch] = useState(""); // input display value
  const [appliedSearch, setAppliedSearch] = useState(""); // sent to server
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // Debounce: reset on every keystroke, fire after 400ms idle
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleSearchChange(value: string) {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setAppliedSearch(value);
      setPage(1);
    }, 400);
  }

  function handleStatusChange(value: string) {
    setStatusFilter(value);
    setPage(1);
    setRowSelection({});
  }

  // ── API ────────────────────────────────────────────────────────────────────
  const { data, isLoading, isFetching } = useAdminGetProductsQuery({
    page,
    pageSize: PAGE_SIZE,
    status: statusFilter || undefined,
    search: appliedSearch || undefined,
    sortBy: "newest",
  });

  const [changeStatus] = useAdminChangeProductStatusMutation();
  const [bulkChangeStatus, { isLoading: isBulkLoading }] =
    useAdminBulkChangeProductStatusMutation();

  async function handleQuickStatus(id: number, status: ProductStatus) {
    await changeStatus({ id, status }).unwrap();
  }

  async function handleBulkStatus(status: ProductStatus) {
    const ids = Object.keys(rowSelection).map((rowIndex) => {
      const item = data?.items[Number(rowIndex)];
      return item!.id;
    });
    if (ids.length === 0) return;
    await bulkChangeStatus({ ids, status }).unwrap();
    setRowSelection({});
  }

  const selectedCount = Object.keys(rowSelection).length;

  // ── Columns ────────────────────────────────────────────────────────────────

  const columns: ColumnDef<AdminProductListItemDto>[] = [
    {
      id: "select",
      size: 40,
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected()
              ? true
              : table.getIsSomePageRowsSelected()
                ? "indeterminate"
                : false
          }
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
          aria-label="Select row"
        />
      ),
    },
    {
      id: "image",
      header: "",
      size: 56,
      cell: ({ row }) => {
        const url = row.original.primaryImageUrl;
        return (
          <div className="h-10 w-10 rounded-md border overflow-hidden bg-muted flex items-center justify-center shrink-0">
            {url ? (
              <img src={url} alt="" className="h-full w-full object-cover" />
            ) : (
              <ImageOff className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Product",
      cell: ({ row }) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-sm">{row.original.title}</p>
          <p className="truncate text-xs text-muted-foreground font-mono">
            /{row.original.slug}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "brand",
      header: "Brand",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.brand ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <ProductStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "activeVariantCount",
      header: "Variants",
      cell: ({ row }) => (
        <span className="text-sm font-medium tabular-nums">
          {row.original.activeVariantCount}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {new Date(row.original.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      size: 48,
      cell: ({ row }) => {
        const { id, status } = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => navigate(`/catalog/products/${id}/edit`)}
              >
                <Pencil className="mr-2 h-3.5 w-3.5" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {status === 1 && (
                <DropdownMenuItem onClick={() => handleQuickStatus(id, 2)}>
                  <CirclePlay className="mr-2 h-3.5 w-3.5 text-green-600" />
                  Publish
                </DropdownMenuItem>
              )}
              {status === 2 && (
                <DropdownMenuItem onClick={() => handleQuickStatus(id, 3)}>
                  <ArchiveRestore className="mr-2 h-3.5 w-3.5 text-zinc-500" />
                  Archive
                </DropdownMenuItem>
              )}
              {status === 3 && (
                <DropdownMenuItem onClick={() => handleQuickStatus(id, 1)}>
                  <XCircle className="mr-2 h-3.5 w-3.5 text-yellow-600" />
                  Revert to Draft
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // ── TanStack table ─────────────────────────────────────────────────────────

  const table = useReactTable({
    data: data?.items ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
    manualSorting: true,
    manualPagination: true,
    pageCount: data?.totalPages ?? 1,
    enableRowSelection: true,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
  });

  const totalCount = data?.totalCount ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const from = totalCount === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, totalCount);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Status tabs */}
        <div className="flex gap-1 rounded-lg border bg-muted/40 p-1 w-fit">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => handleStatusChange(tab.value)}
              className={cn(
                "rounded-md px-3 py-1 text-sm font-medium transition-colors",
                statusFilter === tab.value
                  ? "bg-background shadow text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search — server-side, debounced */}
        <Input
          placeholder="Search by title or brand…"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {/* Bulk action bar */}
      {selectedCount > 0 && (
        <div className="flex items-center gap-3 rounded-lg border bg-muted/50 px-4 py-2.5">
          <CheckSquare2 className="h-4 w-4 text-primary shrink-0" />
          <span className="text-sm font-medium">{selectedCount} selected</span>
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="outline"
              size="sm"
              disabled={isBulkLoading}
              onClick={() => handleBulkStatus(2)}
            >
              <CirclePlay className="mr-1.5 h-3.5 w-3.5 text-green-600" />
              Publish
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isBulkLoading}
              onClick={() => handleBulkStatus(3)}
            >
              <ArchiveRestore className="mr-1.5 h-3.5 w-3.5 text-zinc-500" />
              Archive
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isBulkLoading}
              onClick={() => handleBulkStatus(1)}
            >
              <XCircle className="mr-1.5 h-3.5 w-3.5 text-yellow-600" />
              Set to Draft
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setRowSelection({})}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

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
              // Skeleton rows
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
                  {appliedSearch || statusFilter
                    ? "No products match your filters."
                    : "No products yet. Create your first product."}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    "border-t transition-colors hover:bg-muted/30",
                    isFetching && "opacity-60",
                    row.getIsSelected() && "bg-primary/5",
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
            {from}–{to} of {totalCount} products
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
