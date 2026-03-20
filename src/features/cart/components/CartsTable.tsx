import { useState, useRef } from "react";
import {
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  Mail,
  ShoppingCart,
  User,
  Tag,
} from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

import { useAdminGetCartsQuery } from "../api/cartApi";
import type { AdminCartListItemDto, CartStatus } from "../types";

import { Button } from "@shared/ui/button";
import { Badge } from "@shared/ui/badge";
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

const STATUS_TABS = [
  { value: "", label: "All" },
  { value: "Active", label: "Active" },
  { value: "Abandoned", label: "Abandoned" },
  { value: "Ordered", label: "Ordered" },
] as const;

const statusConfig: Record<CartStatus, { label: string; className: string }> = {
  Active: {
    label: "Active",
    className:
      "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
  },
  Abandoned: {
    label: "Abandoned",
    className:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
  },
  Ordered: {
    label: "Ordered",
    className:
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
  },
};

function CartStatusBadge({ status }: { status: CartStatus }) {
  const cfg = statusConfig[status] ?? statusConfig.Active;
  return (
    <Badge variant="outline" className={cfg.className}>
      {cfg.label}
    </Badge>
  );
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    amount,
  );
}

interface Props {
  onViewDetails: (cart: AdminCartListItemDto) => void;
  onSendEmail: (email: string) => void;
}

export default function CartsTable({ onViewDetails, onSendEmail }: Props) {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
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
  }

  const { data, isLoading, isFetching } = useAdminGetCartsQuery({
    page,
    pageSize: PAGE_SIZE,
    search: appliedSearch || undefined,
    status: statusFilter || undefined,
  });

  function handleSendEmail(cart: AdminCartListItemDto) {
    if (cart.userEmail) {
      onSendEmail(cart.userEmail);
    }
  }

  const columns: ColumnDef<AdminCartListItemDto>[] = [
    {
      id: "customer",
      header: "Customer",
      cell: ({ row }) => {
        const { userEmail, userName, sessionId } = row.original;
        return (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              {userEmail ? (
                <>
                  <p className="text-sm font-medium truncate">{userEmail}</p>
                  {userName && (
                    <p className="text-xs text-muted-foreground truncate">
                      {userName}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-muted-foreground">
                    Guest
                  </p>
                  {sessionId && (
                    <p className="font-mono text-xs text-muted-foreground truncate">
                      {sessionId.slice(0, 12)}…
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "itemCount",
      header: "Items",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <ShoppingCart className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm font-medium tabular-nums">
            {row.original.itemCount}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-semibold tabular-nums">
            {formatCurrency(row.original.total, row.original.currencyCode)}
          </p>
          {row.original.discountTotal > 0 && (
            <p className="text-xs text-green-600 dark:text-green-400 tabular-nums">
              −
              {formatCurrency(
                row.original.discountTotal,
                row.original.currencyCode,
              )}{" "}
              off
            </p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <CartStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "couponCode",
      header: "Coupon",
      cell: ({ row }) =>
        row.original.couponCode ? (
          <div className="flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5 text-purple-500" />
            <span className="font-mono text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 px-1.5 py-0.5 rounded">
              {row.original.couponCode}
            </span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        ),
    },
    {
      accessorKey: "updatedAt",
      header: "Last Activity",
      cell: ({ row }) => (
        <div>
          <p className="text-xs text-muted-foreground whitespace-nowrap">
            {new Date(row.original.updatedAt).toLocaleDateString()}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(row.original.updatedAt).toLocaleTimeString()}
          </p>
        </div>
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
              <Eye className="mr-2 h-3.5 w-3.5" />
              View Cart
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleSendEmail(row.original)}
              disabled={!row.original.userEmail}
            >
              <Mail className="mr-2 h-3.5 w-3.5" />
              Send Reminder Email
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

        <Input
          placeholder="Search by email or name…"
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
                <td colSpan={columns.length} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ShoppingCart className="h-10 w-10 opacity-30" />
                    <p className="text-sm font-medium">
                      {appliedSearch || statusFilter
                        ? "No carts match your filters."
                        : "No customer carts found."}
                    </p>
                    {!appliedSearch && !statusFilter && (
                      <p className="text-xs">
                        Carts will appear here once customers start shopping.
                      </p>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    "border-t transition-colors hover:bg-muted/30 cursor-pointer",
                    isFetching && "opacity-60",
                  )}
                  onClick={() => onViewDetails(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-3"
                      onClick={
                        cell.column.id === "actions"
                          ? (e) => e.stopPropagation()
                          : undefined
                      }
                    >
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
            {from}–{to} of {totalCount} carts
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
