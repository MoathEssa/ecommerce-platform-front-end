/**
 * Toolbar Component
 * Main toolbar container for DataTableV2
 */

import { type Table } from "@tanstack/react-table";
import { cn } from "@/shared/lib/utils";
import { QuickSearch } from "./QuickSearch";
import { FilterButton } from "./FilterButton";
import { ColumnVisibilityDropdown } from "./ColumnVisibilityDropdown";

// ============================================================================
// Types
// ============================================================================

export interface ToolbarProps<TData> {
  /** TanStack Table instance */
  table: Table<TData>;
  /** Global filter value */
  globalFilter: string;
  /** Callback when global filter changes */
  onGlobalFilterChange: (value: string) => void;
  /** Whether filter panel is open */
  isFilterPanelOpen: boolean;
  /** Callback to toggle filter panel */
  onToggleFilterPanel: () => void;
  /** Whether any filters are active */
  isFiltering: boolean;
  /** Number of active filter rules */
  activeFilterCount: number;
  /** Callback to clear all filters */
  onClearFilters: () => void;
  /** Show quick search */
  showQuickSearch?: boolean;
  /** Show advanced filter button */
  showAdvancedFilter?: boolean;
  /** Show column visibility toggle */
  showColumnVisibility?: boolean;
  /** Quick search placeholder */
  quickSearchPlaceholder?: string;
  /** Custom toolbar content */
  children?: React.ReactNode;
  /** Labels for i18n */
  labels?: {
    filter?: string;
    clearFilters?: string;
    columns?: string;
    search?: string;
  };
  /** Additional CSS class */
  className?: string;
}

// ============================================================================
// Default Labels
// ============================================================================

const defaultLabels = {
  filter: "Filter",
  clearFilters: "Clear filters",
  columns: "Columns",
  search: "Search...",
};

// ============================================================================
// Component
// ============================================================================

export function Toolbar<TData>({
  table,
  globalFilter,
  onGlobalFilterChange,
  isFilterPanelOpen,
  onToggleFilterPanel,
  isFiltering,
  activeFilterCount,
  onClearFilters,
  showQuickSearch = true,
  showAdvancedFilter = true,
  showColumnVisibility = true,
  quickSearchPlaceholder,
  children,
  labels: userLabels,
  className,
}: ToolbarProps<TData>) {
  const labels = { ...defaultLabels, ...userLabels };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {/* Quick Search */}
      {showQuickSearch && (
        <QuickSearch
          value={globalFilter}
          onChange={onGlobalFilterChange}
          placeholder={quickSearchPlaceholder || labels.search}
        />
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Advanced Filter Button */}
      {showAdvancedFilter && (
        <FilterButton
          isOpen={isFilterPanelOpen}
          onToggle={onToggleFilterPanel}
          isFiltering={isFiltering}
          activeFilterCount={activeFilterCount}
          onClearFilters={onClearFilters}
          label={labels.filter}
          clearLabel={labels.clearFilters}
        />
      )}

      {/* Column Visibility */}
      {showColumnVisibility && (
        <ColumnVisibilityDropdown table={table} label={labels.columns} />
      )}

      {/* Custom toolbar content */}
      {children}
    </div>
  );
}
