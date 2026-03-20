/**
 * Column Visibility Component
 * Dropdown to toggle column visibility
 */

import { type Table } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Settings2 } from "lucide-react";
import type { DataTableColumnMeta } from "../types";

// ============================================================================
// Types
// ============================================================================

export interface ColumnVisibilityProps<TData> {
  /** TanStack Table instance */
  table: Table<TData>;
  /** Additional CSS class */
  className?: string;
}

export interface ColumnVisibilityContentProps<TData> {
  /** TanStack Table instance */
  table: Table<TData>;
}

// ============================================================================
// Column Visibility Content (for use inside external dropdown)
// ============================================================================

export function ColumnVisibilityContent<TData>({
  table,
}: ColumnVisibilityContentProps<TData>) {
  const { t } = useTranslation();

  const columns = table.getAllColumns().filter((column) => column.getCanHide());

  if (columns.length === 0) {
    return null;
  }

  return (
    <>
      <DropdownMenuLabel>
        {t("dataTable.columns.toggleColumns", "Toggle columns")}
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      {columns.map((column) => {
        const meta = column.columnDef.meta as DataTableColumnMeta | undefined;
        const label = meta?.label || column.id;

        return (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={column.getIsVisible()}
            onCheckedChange={(checked) => column.toggleVisibility(!!checked)}
          >
            {label}
          </DropdownMenuCheckboxItem>
        );
      })}
      <DropdownMenuSeparator />
      <DropdownMenuCheckboxItem
        checked={table.getIsAllColumnsVisible()}
        onCheckedChange={(checked) => table.toggleAllColumnsVisible(!!checked)}
      >
        {t("dataTable.columns.showAll", "Show all")}
      </DropdownMenuCheckboxItem>
    </>
  );
}

// ============================================================================
// Full Component (with its own dropdown)
// ============================================================================

export function ColumnVisibility<TData>({
  table,
  className,
}: ColumnVisibilityProps<TData>) {
  const { t } = useTranslation();

  const columns = table.getAllColumns().filter((column) => column.getCanHide());

  if (columns.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={cn("h-8", className)}>
          <Settings2 className="mr-2 h-4 w-4" />
          {t("dataTable.columns.view", "View")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-50">
        <ColumnVisibilityContent table={table} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
