/**
 * Column Visibility Dropdown Component
 * Dropdown menu for toggling column visibility
 */

import { Settings2, Eye, EyeOff } from "lucide-react";
import { type Table } from "@tanstack/react-table";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface ColumnVisibilityDropdownProps<TData> {
  /** TanStack Table instance */
  table: Table<TData>;
  /** Label text */
  label?: string;
  /** Show all columns label */
  showAllLabel?: string;
  /** Hide all columns label */
  hideAllLabel?: string;
  /** Additional CSS class */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Columns to exclude from the dropdown */
  excludeColumns?: string[];
}

// ============================================================================
// Component
// ============================================================================

export function ColumnVisibilityDropdown<TData>({
  table,
  label = "Columns",
  showAllLabel = "Show all",
  hideAllLabel = "Hide all",
  className,
  disabled = false,
  excludeColumns = [],
}: ColumnVisibilityDropdownProps<TData>) {
  const columns = table
    .getAllColumns()
    .filter(
      (column) => column.getCanHide() && !excludeColumns.includes(column.id),
    );

  const visibleCount = columns.filter((col) => col.getIsVisible()).length;
  const totalCount = columns.length;

  const handleShowAll = () => {
    console.log(
      "[ColumnVisibility] Show all clicked, columns:",
      columns.length,
    );
    // Use setColumnVisibility for bulk update
    const newVisibility: Record<string, boolean> = {};
    columns.forEach((column) => {
      newVisibility[column.id] = true;
    });
    console.log("[ColumnVisibility] Setting visibility:", newVisibility);
    table.setColumnVisibility((prev) => ({
      ...prev,
      ...newVisibility,
    }));
  };

  const handleHideAll = () => {
    console.log(
      "[ColumnVisibility] Hide all clicked, columns:",
      columns.length,
    );
    // Use setColumnVisibility for bulk update
    const newVisibility: Record<string, boolean> = {};
    columns.forEach((column) => {
      newVisibility[column.id] = false;
    });
    console.log("[ColumnVisibility] Setting visibility:", newVisibility);
    table.setColumnVisibility((prev) => ({
      ...prev,
      ...newVisibility,
    }));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("gap-2", className)}
          disabled={disabled}
        >
          <Settings2 className="h-4 w-4" />
          {label}
          {visibleCount < totalCount && (
            <span className="text-xs text-muted-foreground">
              ({visibleCount}/{totalCount})
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-50">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Quick actions */}
        <div className="flex gap-1 px-2 py-1">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-7 text-xs gap-1"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleShowAll();
            }}
          >
            <Eye className="h-3 w-3" />
            {showAllLabel}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-7 text-xs gap-1"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleHideAll();
            }}
          >
            <EyeOff className="h-3 w-3" />
            {hideAllLabel}
          </Button>
        </div>

        <DropdownMenuSeparator />

        {/* Column toggles */}
        {columns.map((column) => {
          // Get column header text
          const header = column.columnDef.header;
          const headerText =
            typeof header === "string"
              ? header
              : (column.columnDef.meta?.label ?? column.id);

          return (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={column.getIsVisible()}
              onCheckedChange={(checked) => {
                console.log(
                  "[ColumnVisibility] Toggle column:",
                  column.id,
                  "to:",
                  checked,
                );
                column.toggleVisibility(!!checked);
              }}
              onSelect={(e) => e.preventDefault()}
              className="capitalize"
            >
              {headerText}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
