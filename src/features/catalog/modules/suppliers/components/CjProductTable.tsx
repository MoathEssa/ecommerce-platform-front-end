import { useState, useMemo } from "react";
import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  type VisibilityState,
  type RowData,
} from "@tanstack/react-table";
import {
  Package,
  Truck,
  Eye,
  EyeOff,
  ChevronDown,
  CheckSquare2,
  Download,
  X,
} from "lucide-react";

import type { CjProductListItemDto } from "../types";
import { formatPrice } from "../utils";
import { CjVariantPanel } from "./CjVariantPanel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shared/ui/table";
import { Badge } from "@shared/ui/badge";
import { Skeleton } from "@shared/ui/skeleton";
import { Button } from "@shared/ui/button";
import { Checkbox } from "@shared/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shared/ui/dropdown-menu";

// ── ColumnMeta augmentation ───────────────────────────────────────────────────
declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string;
  }
}

// ── Column definitions ────────────────────────────────────────────────────────

const col = createColumnHelper<CjProductListItemDto>();

function buildColumns(
  onViewDetails: (p: CjProductListItemDto) => void,
  onToggleVariants: (p: CjProductListItemDto) => void,
  expandedId: string | null,
  selectedIds: Set<string>,
  onToggleSelect: (id: string) => void,
  onToggleSelectAll: () => void,
  allSelected: boolean,
  someSelected: boolean,
) {
  return [
    col.display({
      id: "select",
      meta: { className: "w-10 px-3" },
      enableHiding: false,
      header: () => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              allSelected ? true : someSelected ? "indeterminate" : false
            }
            onCheckedChange={onToggleSelectAll}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={selectedIds.has(row.original.id)}
            onCheckedChange={() => onToggleSelect(row.original.id)}
            aria-label="Select row"
          />
        </div>
      ),
    }),

    col.display({
      id: "image",
      header: "Image",
      meta: { className: "w-14" },
      cell: ({ row }) => {
        const p = row.original;
        return p.bigImage ? (
          <img
            src={p.bigImage}
            alt=""
            className="w-10 h-10 rounded object-cover bg-muted"
          />
        ) : (
          <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
            <Package className="h-4 w-4 text-muted-foreground" />
          </div>
        );
      },
    }),

    col.accessor("nameEn", {
      id: "name",
      header: "Product",
      cell: (info) => (
        <span className="text-sm font-medium line-clamp-2 max-w-70 block">
          {info.getValue()}
        </span>
      ),
    }),

    col.accessor("sku", {
      id: "sku",
      header: "SKU",
      meta: { className: "w-28" },
      cell: (info) => <code className="text-xs">{info.getValue() ?? "—"}</code>,
    }),

    col.accessor("sellPrice", {
      id: "sellPrice",
      header: () => <span className="block text-right">Price</span>,
      meta: { className: "w-24 text-right" },
      cell: (info) => (
        <span className="block text-right tabular-nums">
          {formatPrice(info.getValue())}
        </span>
      ),
    }),

    col.accessor("discountPrice", {
      id: "discountPrice",
      header: () => <span className="block text-right">Discount</span>,
      meta: { className: "w-24 text-right" },
      cell: (info) => {
        const v = info.getValue();
        return v ? (
          <span className="block text-right tabular-nums text-green-600 dark:text-green-400">
            {formatPrice(v)}
          </span>
        ) : (
          <span className="block text-right text-muted-foreground">—</span>
        );
      },
    }),

    col.accessor("freeShipping", {
      id: "shipping",
      header: () => <span className="block text-center">Shipping</span>,
      meta: { className: "w-24 text-center" },
      cell: (info) =>
        info.getValue() ? (
          <div className="flex justify-center">
            <Badge
              variant="outline"
              className="gap-1 text-green-700 border-green-300 dark:text-green-400 dark:border-green-700 text-[11px]"
            >
              <Truck className="h-2.5 w-2.5" />
              Free
            </Badge>
          </div>
        ) : (
          <span className="block text-center text-muted-foreground text-xs">
            Paid
          </span>
        ),
    }),

    col.accessor("warehouseInventoryNum", {
      id: "inventory",
      header: () => <span className="block text-right">Inventory</span>,
      meta: { className: "w-24 text-right" },
      cell: (info) => {
        const v = info.getValue();
        return (
          <span className="block text-right tabular-nums">
            {v != null ? v.toLocaleString() : "—"}
          </span>
        );
      },
    }),

    col.display({
      id: "category",
      header: "Category",
      meta: { className: "w-40" },
      cell: ({ row }) => {
        const p = row.original;
        const name =
          p.threeCategoryName ?? p.twoCategoryName ?? p.oneCategoryName;
        return (
          <span className="text-xs text-muted-foreground truncate block max-w-37.5">
            {name ?? "—"}
          </span>
        );
      },
    }),

    col.accessor("productType", {
      id: "productType",
      header: "Type",
      meta: { className: "w-24" },
      cell: (info) => (
        <span className="text-xs text-muted-foreground">
          {info.getValue() ?? "—"}
        </span>
      ),
    }),

    col.accessor("deliveryCycle", {
      id: "deliveryCycle",
      header: "Delivery",
      meta: { className: "w-24" },
      cell: (info) => {
        const v = info.getValue();
        return (
          <span className="text-xs text-muted-foreground">
            {v ? `${v} days` : "—"}
          </span>
        );
      },
    }),

    // ── Non-hideable action columns ──────────────────────────────────────────

    col.display({
      id: "details",
      header: () => <span className="block text-center">Details</span>,
      meta: { className: "w-16 text-center" },
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => onViewDetails(row.original)}
          >
            View
          </Button>
        </div>
      ),
    }),

    col.display({
      id: "variants",
      header: () => <span className="block text-center">Variants</span>,
      meta: { className: "w-24 text-center" },
      enableHiding: false,
      cell: ({ row }) => {
        const p = row.original;
        const isOpen = expandedId === p.id;
        return (
          <div className="flex justify-center">
            <Button
              variant={isOpen ? "default" : "outline"}
              size="sm"
              className="h-7 gap-1.5 text-xs"
              onClick={() => onToggleVariants(p)}
            >
              Variants
              <ChevronDown
                className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </Button>
          </div>
        );
      },
    }),
  ];
}

// ── Default visibility ────────────────────────────────────────────────────────

const DEFAULT_VISIBILITY: VisibilityState = {
  deliveryCycle: false,
  productType: false,
};

// ── Props ─────────────────────────────────────────────────────────────────────

interface CjProductTableProps {
  items: CjProductListItemDto[];
  isLoading: boolean;
  isFetching: boolean;
  hasSearched: boolean;
  onViewDetails: (product: CjProductListItemDto) => void;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onBulkImport: (products: CjProductListItemDto[]) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CjProductTable({
  items,
  isLoading,
  isFetching,
  hasSearched,
  onViewDetails,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onBulkImport,
}: CjProductTableProps) {
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(DEFAULT_VISIBILITY);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function handleToggleVariants(p: CjProductListItemDto) {
    setExpandedId((prev) => (prev === p.id ? null : p.id));
  }

  const allSelected =
    items.length > 0 && items.every((p) => selectedIds.has(p.id));
  const someSelected = !allSelected && items.some((p) => selectedIds.has(p.id));

  const columns = useMemo(
    () =>
      buildColumns(
        onViewDetails,
        handleToggleVariants,
        expandedId,
        selectedIds,
        onToggleSelect,
        onToggleSelectAll,
        allSelected,
        someSelected,
      ),
    [
      onViewDetails,
      expandedId,
      selectedIds,
      onToggleSelect,
      onToggleSelectAll,
      allSelected,
      someSelected,
    ],
  );

  const table = useReactTable({
    data: items,
    columns,
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  const hiddenCount = table
    .getAllLeafColumns()
    .filter((c) => c.getCanHide() && !c.getIsVisible()).length;

  return (
    <div className="space-y-2">
      {/* Top bar: column visibility + bulk action */}
      <div className="flex items-center justify-between gap-3">
        {/* Bulk action bar */}
        {selectedIds.size > 0 ? (
          <div className="flex items-center gap-3 rounded-lg border bg-muted/50 px-4 py-2 flex-1">
            <CheckSquare2 className="h-4 w-4 text-primary shrink-0" />
            <span className="text-sm font-medium">
              {selectedIds.size} product{selectedIds.size > 1 ? "s" : ""}{" "}
              selected
            </span>
            <Button
              size="sm"
              className="ml-auto gap-1.5"
              onClick={() =>
                onBulkImport(items.filter((p) => selectedIds.has(p.id)))
              }
            >
              <Download className="h-3.5 w-3.5" />
              Import Selected
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() =>
                items.forEach(
                  (p) => selectedIds.has(p.id) && onToggleSelect(p.id),
                )
              }
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div />
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
              {hiddenCount > 0 ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
              Columns
              {hiddenCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 h-4 px-1 text-[10px] font-semibold"
                >
                  -{hiddenCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllLeafColumns()
              .filter((c) => c.getCanHide())
              .map((c) => (
                <DropdownMenuCheckboxItem
                  key={c.id}
                  checked={c.getIsVisible()}
                  onCheckedChange={(v) => c.toggleVisibility(v)}
                  className="capitalize"
                >
                  {typeof c.columnDef.header === "string"
                    ? c.columnDef.header
                    : c.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-hidden relative">
        {isFetching && !isLoading && (
          <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center rounded-lg">
            <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={
                      (header.column.columnDef.meta as { className?: string })
                        ?.className
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  {table.getVisibleLeafColumns().map((c) => (
                    <TableCell key={c.id}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={table.getVisibleLeafColumns().length}
                  className="text-center py-12 text-muted-foreground"
                >
                  {hasSearched
                    ? "No products found. Try a different keyword or filter."
                    : "Enter a keyword above to search CJ products."}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={
                          (
                            cell.column.columnDef.meta as {
                              className?: string;
                            }
                          )?.className
                        }
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {expandedId === row.original.id && (
                    <TableRow
                      key={`${row.id}-variants`}
                      className="hover:bg-transparent"
                    >
                      <CjVariantPanel
                        product={row.original}
                        colSpan={table.getVisibleLeafColumns().length}
                      />
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
