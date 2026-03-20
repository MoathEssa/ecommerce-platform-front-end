/**
 * Column Header Component
 * Sortable column header with sort indicators
 */

import { type Column } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown, EyeOff } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

// ============================================================================
// Types
// ============================================================================

export interface ColumnHeaderProps<TData, TValue> {
  /** Column instance from TanStack Table */
  column: Column<TData, TValue>;
  /** Header title */
  title: string;
  /** Additional CSS class */
  className?: string;
  /** Show hide option in dropdown */
  showHideOption?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export function ColumnHeader<TData, TValue>({
  column,
  title,
  className,
  showHideOption = true,
}: ColumnHeaderProps<TData, TValue>) {
  const { t } = useTranslation();

  if (!column.getCanSort()) {
    return <div className={cn("flex items-center", className)}>{title}</div>;
  }

  const sortDirection = column.getIsSorted();

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span>{title}</span>
            {sortDirection === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : sortDirection === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            {t("dataTable.sort.asc", "Asc")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            {t("dataTable.sort.desc", "Desc")}
          </DropdownMenuItem>
          {sortDirection && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => column.clearSorting()}>
                <ArrowUpDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                {t("dataTable.sort.clear", "Clear")}
              </DropdownMenuItem>
            </>
          )}
          {showHideOption && column.getCanHide() && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                <EyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                {t("dataTable.column.hide", "Hide")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
