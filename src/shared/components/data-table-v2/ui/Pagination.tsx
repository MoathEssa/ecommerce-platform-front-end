/**
 * Pagination Component
 * Table pagination controls with page size selector
 */

import { type Table } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

// ============================================================================
// Types
// ============================================================================

export interface PaginationProps<TData> {
  /** TanStack Table instance */
  table: Table<TData>;
  /** Available page size options */
  pageSizeOptions?: number[];
  /** Show page size selector */
  showPageSizeSelector?: boolean;
  /** Show row count info */
  showRowCount?: boolean;
  /** Show selected count */
  showSelectedCount?: boolean;
  /** Additional CSS class */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function Pagination<TData>({
  table,
  pageSizeOptions = [10, 20, 50, 100],
  showPageSizeSelector = true,
  showRowCount = true,
  showSelectedCount = true,
  className,
}: PaginationProps<TData>) {
  const { t } = useTranslation();

  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();
  const totalRows = table.getFilteredRowModel().rows.length;
  const selectedRows = table.getFilteredSelectedRowModel().rows.length;

  // Calculate display range
  const start = pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div
      className={cn("flex items-center justify-between px-2 py-4", className)}
    >
      {/* Left side: Row info */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        {showSelectedCount && selectedRows > 0 && (
          <span>
            {t("dataTable.pagination.selected", "{{count}} selected", {
              count: selectedRows,
            })}
          </span>
        )}
        {showRowCount && (
          <span>
            {t(
              "dataTable.pagination.showing",
              "Showing {{start}}-{{end}} of {{total}}",
              {
                start,
                end,
                total: totalRows,
              },
            )}
          </span>
        )}
      </div>

      {/* Right side: Controls */}
      <div className="flex items-center gap-6">
        {/* Page size selector */}
        {showPageSizeSelector && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {t("dataTable.pagination.rowsPerPage", "Rows per page")}
            </span>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger className="h-8 w-18">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Page info */}
        <div className="text-sm text-muted-foreground">
          {t("dataTable.pagination.page", "Page {{current}} of {{total}}", {
            current: pageIndex + 1,
            total: pageCount || 1,
          })}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">
              {t("dataTable.pagination.firstPage", "First page")}
            </span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">
              {t("dataTable.pagination.previousPage", "Previous page")}
            </span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">
              {t("dataTable.pagination.nextPage", "Next page")}
            </span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">
              {t("dataTable.pagination.lastPage", "Last page")}
            </span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
