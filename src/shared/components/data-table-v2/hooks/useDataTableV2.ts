/**
 * useDataTableV2 - Main hook for DataTableV2
 * Combines TanStack Table with filtering, sorting, pagination
 */

import { useMemo, useCallback, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  type PaginationState,
  type Table,
  type Row,
} from "@tanstack/react-table";
import type { RuleGroupType } from "react-querybuilder";
import { applyFilter, createTableFilterFn } from "../engine";
import { generateFieldsFromColumns } from "../filters/fieldConfig";
import type { FilterMode } from "../types";

// ============================================================================
// Type Definitions
// ============================================================================

export interface UseDataTableV2Options<TData> {
  /** Data to display in the table */
  data: TData[];
  /** Column definitions */
  columns: ColumnDef<TData, unknown>[];
  /** Filtering mode: 'client' applies filters locally, 'server' expects pre-filtered data */
  filterMode?: FilterMode;
  /** Enable advanced filter */
  enableAdvancedFilter?: boolean;
  /** Enable row selection */
  enableRowSelection?: boolean;
  /** Enable multi row selection */
  enableMultiRowSelection?: boolean;
  /** Total row count for server-side pagination */
  totalRowCount?: number;
  /** Callback when filter changes (for server-side filtering) */
  onFilterChange?: (query: RuleGroupType) => void;
  /** Callback when sorting changes (for server-side sorting) */
  onSortingChange?: (sorting: SortingState) => void;
  /** Callback when pagination changes (for server-side pagination) */
  onPaginationChange?: (pagination: PaginationState) => void;
  /** Global filter value (quick search) */
  globalFilter?: string;
  /** Callback when global filter changes */
  onGlobalFilterChange?: (value: string) => void;
  /** Initial query */
  initialQuery?: RuleGroupType;
  /** Initial sorting */
  initialSorting?: SortingState;
  /** Initial pagination */
  initialPagination?: PaginationState;
  /** Initial column visibility */
  initialColumnVisibility?: VisibilityState;
  /** Default page size */
  defaultPageSize?: number;
}

export interface UseDataTableV2Return<TData> {
  /** TanStack Table instance */
  table: Table<TData>;
  /** Processed data (filtered for client mode) */
  processedData: TData[];
  /** Current query */
  query: RuleGroupType;
  /** Set query */
  setQuery: (query: RuleGroupType) => void;
  /** Current sorting state */
  sorting: SortingState;
  /** Set sorting */
  setSorting: (sorting: SortingState) => void;
  /** Current pagination state */
  pagination: PaginationState;
  /** Set pagination */
  setPagination: (pagination: PaginationState) => void;
  /** Global filter value (quick search) */
  globalFilter: string;
  /** Set global filter */
  setGlobalFilter: (value: string) => void;
  /** Column visibility state */
  columnVisibility: VisibilityState;
  /** Set column visibility */
  setColumnVisibility: (visibility: VisibilityState) => void;
  /** Row selection state */
  rowSelection: Record<string, boolean>;
  /** Set row selection */
  setRowSelection: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  /** Fields generated from columns for query builder */
  fields: ReturnType<typeof generateFieldsFromColumns>;
  /** Is currently filtering */
  isFiltering: boolean;
  /** Total page count */
  pageCount: number;
  /** Selected rows */
  selectedRows: Row<TData>[];
  /** Reset all filters */
  resetFilters: () => void;
  /** Reset sorting */
  resetSorting: () => void;
  /** Reset pagination */
  resetPagination: () => void;
  /** Reset all state */
  resetAll: () => void;
  /** Config values */
  config: {
    enableAdvancedFilter: boolean;
  };
}

// ============================================================================
// Default Values
// ============================================================================

const defaultQuery: RuleGroupType = { combinator: "and", rules: [] };
const defaultSorting: SortingState = [];
const defaultPagination: PaginationState = { pageIndex: 0, pageSize: 10 };

// ============================================================================
// Main Hook
// ============================================================================

export function useDataTableV2<TData extends Record<string, unknown>>(
  options: UseDataTableV2Options<TData>,
): UseDataTableV2Return<TData> {
  const {
    data,
    columns,
    filterMode = "client",
    enableAdvancedFilter = true,
    enableRowSelection = false,
    enableMultiRowSelection = true,
    totalRowCount,
    onFilterChange,
    onSortingChange,
    onPaginationChange,
    globalFilter: externalGlobalFilter,
    onGlobalFilterChange,
    initialQuery = defaultQuery,
    initialSorting = defaultSorting,
    initialPagination = defaultPagination,
    initialColumnVisibility = {},
  } = options;

  // ============================================================================
  // Local State
  // ============================================================================

  const [query, setLocalQuery] = useState<RuleGroupType>(initialQuery);
  const [sorting, setLocalSorting] = useState<SortingState>(initialSorting);
  const [pagination, setLocalPagination] =
    useState<PaginationState>(initialPagination);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialColumnVisibility,
  );
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [internalGlobalFilter, setInternalGlobalFilter] = useState<string>("");

  // Global filter (controlled or uncontrolled)
  const globalFilter = externalGlobalFilter ?? internalGlobalFilter;
  const setGlobalFilter = useCallback(
    (value: string) => {
      if (onGlobalFilterChange) {
        onGlobalFilterChange(value);
      } else {
        setInternalGlobalFilter(value);
      }
    },
    [onGlobalFilterChange],
  );

  // ============================================================================
  // State Setters
  // ============================================================================

  const setQuery = useCallback(
    (newQuery: RuleGroupType) => {
      setLocalQuery(newQuery);
      onFilterChange?.(newQuery);
    },
    [onFilterChange],
  );

  const setSorting = useCallback(
    (newSorting: SortingState) => {
      setLocalSorting(newSorting);
      onSortingChange?.(newSorting);
    },
    [onSortingChange],
  );

  const setPagination = useCallback(
    (newPagination: PaginationState) => {
      setLocalPagination(newPagination);
      onPaginationChange?.(newPagination);
    },
    [onPaginationChange],
  );

  // ============================================================================
  // Client-Side Filtering
  // ============================================================================

  const processedData = useMemo(() => {
    if (filterMode === "server") {
      return data;
    }

    let result = data;

    // Apply advanced filter (query builder)
    if (query.rules && query.rules.length > 0) {
      result = applyFilter(result, query);
    }

    // Apply global filter (quick search)
    if (globalFilter && globalFilter.trim()) {
      const searchTerm = globalFilter.toLowerCase().trim();
      result = result.filter((row) => {
        return Object.values(row).some((value) => {
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(searchTerm);
        });
      });
    }

    return result;
  }, [data, query, globalFilter, filterMode]);

  // ============================================================================
  // Generate Fields for Query Builder
  // ============================================================================

  const fields = useMemo(() => {
    return generateFieldsFromColumns(
      columns as ColumnDef<Record<string, unknown>, unknown>[],
    );
  }, [columns]);

  // ============================================================================
  // TanStack Table Instance
  // ============================================================================

  const table = useReactTable({
    data: processedData,
    columns,
    state: {
      sorting,
      pagination,
      columnVisibility,
      rowSelection,
    },
    rowCount: filterMode === "server" ? totalRowCount : undefined,
    manualPagination: filterMode === "server",
    manualSorting: filterMode === "server",
    manualFiltering: true,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel:
      filterMode === "client" ? getSortedRowModel() : undefined,
    getPaginationRowModel:
      filterMode === "client" ? getPaginationRowModel() : undefined,
    getFilteredRowModel:
      filterMode === "client" ? getFilteredRowModel() : undefined,

    globalFilterFn:
      filterMode === "client" ? createTableFilterFn(query) : undefined,

    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      setSorting(newSorting);
    },
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function" ? updater(pagination) : updater;
      setPagination(newPagination);
    },
    onColumnVisibilityChange: (updater) => {
      const newVisibility =
        typeof updater === "function" ? updater(columnVisibility) : updater;
      setColumnVisibility(newVisibility);
    },
    onRowSelectionChange: setRowSelection,

    enableRowSelection,
    enableMultiRowSelection,
  });

  // ============================================================================
  // Computed Values
  // ============================================================================

  const isFiltering = useMemo(() => {
    return query.rules && query.rules.length > 0;
  }, [query]);

  const pageCount = useMemo(() => {
    if (filterMode === "server" && totalRowCount !== undefined) {
      return Math.ceil(totalRowCount / pagination.pageSize);
    }
    return table.getPageCount();
  }, [filterMode, totalRowCount, pagination.pageSize, table]);

  const selectedRows = useMemo(() => {
    return table.getSelectedRowModel().rows;
  }, [table]);

  // ============================================================================
  // Reset Functions
  // ============================================================================

  const resetFilters = useCallback(() => {
    setQuery(defaultQuery);
  }, [setQuery]);

  const resetSorting = useCallback(() => {
    setSorting(defaultSorting);
  }, [setSorting]);

  const resetPagination = useCallback(() => {
    setPagination(defaultPagination);
  }, [setPagination]);

  const resetAll = useCallback(() => {
    resetFilters();
    resetSorting();
    resetPagination();
    setColumnVisibility({});
    setRowSelection({});
  }, [resetFilters, resetSorting, resetPagination]);

  // ============================================================================
  // Return
  // ============================================================================

  return {
    table,
    processedData,
    query,
    setQuery,
    sorting,
    setSorting,
    pagination,
    setPagination,
    globalFilter,
    setGlobalFilter,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setRowSelection,
    fields,
    isFiltering,
    pageCount,
    selectedRows,
    resetFilters,
    resetSorting,
    resetPagination,
    resetAll,
    config: {
      enableAdvancedFilter,
    },
  };
}
