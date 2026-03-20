/**
 * DataTable Core Component
 * Renders the main table structure using TanStack Table
 */

import { flexRender, type Table as TanStackTable } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Skeleton } from "@/shared/ui/skeleton";

// ============================================================================
// Types
// ============================================================================

export interface DataTableCoreProps<TData> {
  /** TanStack Table instance */
  table: TanStackTable<TData>;
  /** Loading state */
  isLoading?: boolean;
  /** Custom loading component */
  loadingComponent?: React.ReactNode;
  /** Custom empty state component */
  emptyStateComponent?: React.ReactNode;
  /** Enable row click */
  onRowClick?: (row: TData) => void;
  /** Additional CSS class */
  className?: string;
  /** Table caption for accessibility */
  caption?: string;
}

// ============================================================================
// Component
// ============================================================================

export function DataTableCore<TData>({
  table,
  isLoading = false,
  loadingComponent,
  emptyStateComponent,
  onRowClick,
  className,
  caption,
}: DataTableCoreProps<TData>) {
  const { t } = useTranslation();
  const columns = table.getAllColumns();
  const rows = table.getRowModel().rows;

  // Default loading skeleton
  const defaultLoadingComponent = (
    <TableBody>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          {columns.map((_, colIndex) => (
            <TableCell key={colIndex}>
              <Skeleton className="h-6 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );

  // Default empty state (content only, will be wrapped in TableBody/TableRow/TableCell)
  const defaultEmptyComponent = (
    <div className="flex flex-col items-center justify-center w-full h-full py-12 text-muted-foreground">
      <p>{t("dataTable.noResults", "No results found.")}</p>
    </div>
  );

  return (
    <div className={cn("rounded-md border", className)}>
      <Table>
        {caption && <caption className="sr-only">{caption}</caption>}

        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  className="py-3 px-4"
                  style={{
                    width:
                      header.getSize() !== 150 ? header.getSize() : undefined,
                  }}
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

        {isLoading ? (
          loadingComponent || defaultLoadingComponent
        ) : rows.length === 0 ? (
          <TableBody>
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columns.length} className="h-48 p-0">
                {emptyStateComponent || defaultEmptyComponent}
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? "selected" : undefined}
                onClick={
                  onRowClick ? () => onRowClick(row.original) : undefined
                }
                className={cn(
                  onRowClick && "cursor-pointer hover:bg-muted/50",
                  row.getIsSelected() && "bg-muted/50",
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-3 px-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </div>
  );
}
