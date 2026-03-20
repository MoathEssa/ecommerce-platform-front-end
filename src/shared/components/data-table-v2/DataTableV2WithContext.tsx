import { useCallback } from "react";
import type { RuleGroupType } from "react-querybuilder";
import type { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/shared/lib/utils";
import {
  DataTableProvider,
  useDataTableContext,
  type DataTableContextConfig,
} from "./context";
import { DataTableErrorBoundary, Toolbar, EmptyState } from "./components";
import { DataTableCore } from "./ui/Table";
import { Pagination } from "./ui/Pagination";
import { QueryBuilderFilter } from "./filters/QueryBuilderFilter";

// ============================================================================
// Types
// ============================================================================

export interface DataTableV2WithContextProps<TData extends object> {
  /** Data to display in the table */
  data: TData[];
  /** Column definitions */
  columns: ColumnDef<TData, unknown>[];
  /** Configuration options */
  config?: Partial<DataTableContextConfig>;
  /** Additional class name for the container */
  className?: string;
  /** Show the toolbar */
  showToolbar?: boolean;
  /** Show quick search input */
  showQuickSearch?: boolean;
  /** Show advanced filter button */
  showAdvancedFilter?: boolean;
  /** Show column visibility toggle */
  showColumnVisibility?: boolean;
  /** Show pagination */
  showPagination?: boolean;
  /** Custom toolbar content (rendered after built-in controls) */
  toolbarContent?: React.ReactNode;
  /** Custom empty state */
  emptyState?: React.ReactNode;
  /** Loading state */
  isLoading?: boolean;
  /** Row click handler */
  onRowClick?: (row: TData) => void;
  /** Quick search placeholder */
  quickSearchPlaceholder?: string;
  /** Total row count for server-side pagination */
  totalRowCount?: number;
  /** Callback when filter changes (for server-side filtering) */
  onFilterChange?: (query: RuleGroupType) => void;
  /** Callback when sorting changes (for server-side sorting) */
  onSortingChange?: (sorting: { id: string; desc: boolean }[]) => void;
  /** Callback when pagination changes (for server-side pagination) */
  onPaginationChange?: (pagination: {
    pageIndex: number;
    pageSize: number;
  }) => void;
  /** Enable row selection */
  enableRowSelection?: boolean;
  /** Enable multi row selection */
  enableMultiRowSelection?: boolean;
  /** Labels for internationalization */
  labels?: {
    filter?: string;
    clearFilters?: string;
    columns?: string;
    noResults?: string;
    rowsPerPage?: string;
    page?: string;
    of?: string;
    search?: string;
  };
  /** Error boundary fallback */
  errorFallback?: React.ReactNode;
  /** Callback when error occurs */
  onError?: (error: Error) => void;
}

// ============================================================================
// Inner Content Component (uses context)
// ============================================================================

interface DataTableContentProps<TData> {
  showToolbar: boolean;
  showQuickSearch: boolean;
  showAdvancedFilter: boolean;
  showColumnVisibility: boolean;
  showPagination: boolean;
  toolbarContent?: React.ReactNode;
  emptyState?: React.ReactNode;
  isLoading: boolean;
  onRowClick?: (row: TData) => void;
  quickSearchPlaceholder?: string;
  labels?: {
    filter?: string;
    clearFilters?: string;
    columns?: string;
    noResults?: string;
    search?: string;
  };
  className?: string;
}

function DataTableContent<TData extends object>({
  showToolbar,
  showQuickSearch,
  showAdvancedFilter,
  showColumnVisibility,
  showPagination,
  toolbarContent,
  emptyState,
  isLoading,
  onRowClick,
  quickSearchPlaceholder,
  labels,
  className,
}: DataTableContentProps<TData>) {
  const { state, dispatch, table, computed, fields, config } =
    useDataTableContext<TData>();

  // Handle filter change from QueryBuilder
  const handleFilterChange = useCallback(
    (newQuery: RuleGroupType) => {
      dispatch({ type: "SET_QUERY", payload: newQuery });
    },
    [dispatch],
  );

  // Handle global filter change
  const handleGlobalFilterChange = useCallback(
    (value: string) => {
      dispatch({ type: "SET_GLOBAL_FILTER", payload: value });
    },
    [dispatch],
  );

  // Handle filter panel toggle
  const handleToggleFilterPanel = useCallback(() => {
    dispatch({ type: "TOGGLE_FILTER_PANEL" });
  }, [dispatch]);

  // Handle clear filters
  const handleClearFilters = useCallback(() => {
    dispatch({ type: "RESET_FILTERS" });
  }, [dispatch]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar */}
      {showToolbar && (
        <Toolbar
          table={table}
          globalFilter={state.globalFilter}
          onGlobalFilterChange={handleGlobalFilterChange}
          isFilterPanelOpen={state.isFilterPanelOpen}
          onToggleFilterPanel={handleToggleFilterPanel}
          isFiltering={computed.isFiltering}
          activeFilterCount={computed.activeFilterCount}
          onClearFilters={handleClearFilters}
          showQuickSearch={showQuickSearch}
          showAdvancedFilter={showAdvancedFilter && config.enableAdvancedFilter}
          showColumnVisibility={showColumnVisibility}
          quickSearchPlaceholder={quickSearchPlaceholder}
          labels={labels}
        >
          {toolbarContent}
        </Toolbar>
      )}

      {/* Advanced Filter Panel */}
      {state.isFilterPanelOpen && config.enableAdvancedFilter && (
        <div className="rounded-lg border bg-card p-4">
          <QueryBuilderFilter
            fields={
              fields as Parameters<typeof QueryBuilderFilter>[0]["fields"]
            }
            query={state.query}
            onQueryChange={handleFilterChange}
          />
        </div>
      )}

      {/* Table */}
      <DataTableCore
        table={table}
        isLoading={isLoading}
        emptyStateComponent={
          emptyState ?? (
            <EmptyState
              title={labels?.noResults ?? "No results found."}
              description="Try adjusting your search or filter to find what you're looking for."
            />
          )
        }
        onRowClick={onRowClick}
      />

      {/* Pagination */}
      {showPagination && <Pagination table={table} />}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function DataTableV2WithContext<TData extends object>({
  data,
  columns,
  config,
  className,
  showToolbar = true,
  showQuickSearch = true,
  showAdvancedFilter = true,
  showColumnVisibility = true,
  showPagination = true,
  toolbarContent,
  emptyState,
  isLoading = false,
  onRowClick,
  quickSearchPlaceholder,
  totalRowCount,
  onFilterChange,
  onSortingChange,
  onPaginationChange,
  enableRowSelection = false,
  enableMultiRowSelection = true,
  labels,
  errorFallback,
  onError,
}: DataTableV2WithContextProps<TData>) {
  return (
    <DataTableErrorBoundary fallback={errorFallback} onError={onError}>
      <DataTableProvider
        data={data as unknown as Record<string, unknown>[]}
        columns={
          columns as unknown as ColumnDef<Record<string, unknown>, unknown>[]
        }
        config={config}
        totalRowCount={totalRowCount}
        onFilterChange={onFilterChange}
        onSortingChange={onSortingChange}
        onPaginationChange={onPaginationChange}
        enableRowSelection={enableRowSelection}
        enableMultiRowSelection={enableMultiRowSelection}
      >
        <DataTableContent
          showToolbar={showToolbar}
          showQuickSearch={showQuickSearch}
          showAdvancedFilter={showAdvancedFilter}
          showColumnVisibility={showColumnVisibility}
          showPagination={showPagination}
          toolbarContent={toolbarContent}
          emptyState={emptyState}
          isLoading={isLoading}
          onRowClick={onRowClick}
          quickSearchPlaceholder={quickSearchPlaceholder}
          labels={labels}
          className={className}
        />
      </DataTableProvider>
    </DataTableErrorBoundary>
  );
}

export default DataTableV2WithContext;
