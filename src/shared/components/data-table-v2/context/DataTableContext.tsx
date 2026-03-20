import {
  createContext,
  useReducer,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type Table,
} from "@tanstack/react-table";
import type { RuleGroupType } from "react-querybuilder";
import type {
  DataTableState,
  DataTableAction,
  DataTableContextValue,
  DataTableContextConfig,
} from "./types";
import { dataTableReducer, createInitialState } from "./reducer";
import { DEFAULT_CONFIG } from "../constants";
import { applyFilter, createTableFilterFn } from "../engine";
import { generateFieldsFromColumns } from "../filters/fieldConfig";

const DataTableContext = createContext<DataTableContextValue<unknown> | null>(
  null,
);

DataTableContext.displayName = "DataTableContext";

export interface DataTableProviderProps<TData extends Record<string, unknown>> {
  children: ReactNode;
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  config?: Partial<DataTableContextConfig>;
  totalRowCount?: number;
  onFilterChange?: (query: RuleGroupType) => void;
  onSortingChange?: (sorting: DataTableState["sorting"]) => void;
  onPaginationChange?: (pagination: DataTableState["pagination"]) => void;
  onRowSelectionChange?: (selection: Record<string, boolean>) => void;
  enableRowSelection?: boolean;
  enableMultiRowSelection?: boolean;
}

export function DataTableProvider<TData extends Record<string, unknown>>({
  children,
  data,
  columns,
  config: userConfig,
  totalRowCount,
  onFilterChange,
  onSortingChange,
  onPaginationChange,
  onRowSelectionChange,
  enableRowSelection = false,
  enableMultiRowSelection = true,
}: DataTableProviderProps<TData>) {
  const config = useMemo<DataTableContextConfig>(
    () => ({
      ...DEFAULT_CONFIG,
      ...userConfig,
    }),
    [userConfig],
  );

  const initialState = useMemo(
    () =>
      createInitialState({
        query: config.initialQuery,
        sorting: config.initialSorting,
        pagination: config.initialPagination ?? {
          pageIndex: 0,
          pageSize: config.defaultPageSize ?? 10,
        },
        columnVisibility: config.initialColumnVisibility,
      }),
    [config],
  );

  const [state, dispatch] = useReducer(dataTableReducer, initialState);

  // ============================================================================
  // Client-Side Data Processing
  // ============================================================================

  const processedData = useMemo(() => {
    if (config.filterMode === "server") {
      return data;
    }

    let result = data;

    if (state.query.rules && state.query.rules.length > 0) {
      result = applyFilter(result, state.query);
    }

    if (state.globalFilter && state.globalFilter.trim()) {
      const searchTerm = state.globalFilter.toLowerCase().trim();
      result = result.filter((row) => {
        return Object.values(row).some((value) => {
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(searchTerm);
        });
      });
    }

    return result;
  }, [data, state.query, state.globalFilter, config.filterMode]);

  // ============================================================================
  // Generate Fields for Query Builder
  // ============================================================================

  const fields = useMemo(() => {
    return generateFieldsFromColumns(
      columns as ColumnDef<Record<string, unknown>, unknown>[],
    );
  }, [columns]);

  // ============================================================================
  // Dispatch Wrapper with Callbacks
  // ============================================================================

  const dispatchWithCallbacks = useCallback(
    (action: DataTableAction) => {
      dispatch(action);

      // Call external callbacks based on action type
      switch (action.type) {
        case "SET_QUERY":
          onFilterChange?.(action.payload);
          break;
        case "SET_SORTING":
          onSortingChange?.(action.payload);
          break;
        case "SET_PAGINATION":
          onPaginationChange?.(action.payload);
          break;
        case "SET_PAGE_INDEX":
          onPaginationChange?.({
            ...state.pagination,
            pageIndex: action.payload,
          });
          break;
        case "SET_PAGE_SIZE":
          onPaginationChange?.({
            pageIndex: 0,
            pageSize: action.payload,
          });
          break;
        case "SET_ROW_SELECTION":
          onRowSelectionChange?.(action.payload);
          break;
      }
    },
    [
      state.pagination,
      onFilterChange,
      onSortingChange,
      onPaginationChange,
      onRowSelectionChange,
    ],
  );

  // ============================================================================
  // TanStack Table Instance
  // ============================================================================

  const table = useReactTable({
    data: processedData,
    columns,
    state: {
      sorting: state.sorting,
      pagination: state.pagination,
      columnVisibility: state.columnVisibility,
      rowSelection: state.rowSelection,
    },
    rowCount: config.filterMode === "server" ? totalRowCount : undefined,
    manualPagination: config.filterMode === "server",
    manualSorting: config.filterMode === "server",
    manualFiltering: true,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel:
      config.filterMode === "client" ? getSortedRowModel() : undefined,
    getPaginationRowModel:
      config.filterMode === "client" ? getPaginationRowModel() : undefined,
    getFilteredRowModel:
      config.filterMode === "client" ? getFilteredRowModel() : undefined,

    globalFilterFn:
      config.filterMode === "client"
        ? createTableFilterFn(state.query)
        : undefined,

    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function" ? updater(state.sorting) : updater;
      dispatchWithCallbacks({ type: "SET_SORTING", payload: newSorting });
    },
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function" ? updater(state.pagination) : updater;
      dispatchWithCallbacks({ type: "SET_PAGINATION", payload: newPagination });
    },
    onColumnVisibilityChange: (updater) => {
      const newVisibility =
        typeof updater === "function"
          ? updater(state.columnVisibility)
          : updater;
      dispatchWithCallbacks({
        type: "SET_COLUMN_VISIBILITY",
        payload: newVisibility,
      });
    },
    onRowSelectionChange: (updater) => {
      const newSelection =
        typeof updater === "function" ? updater(state.rowSelection) : updater;
      dispatchWithCallbacks({
        type: "SET_ROW_SELECTION",
        payload: newSelection,
      });
    },

    enableRowSelection,
    enableMultiRowSelection,
  });

  // ============================================================================
  // Computed Values
  // ============================================================================

  const computed = useMemo(
    () => ({
      isFiltering: state.query.rules && state.query.rules.length > 0,
      activeFilterCount: state.query.rules?.length ?? 0,
      pageCount:
        config.filterMode === "server" && totalRowCount !== undefined
          ? Math.ceil(totalRowCount / state.pagination.pageSize)
          : table.getPageCount(),
      selectedRows: table.getSelectedRowModel().rows.map((row) => row.original),
      processedData,
    }),
    [
      state.query.rules,
      state.pagination.pageSize,
      config.filterMode,
      totalRowCount,
      table,
      processedData,
    ],
  );

  // ============================================================================
  // Context Value
  // ============================================================================

  const contextValue = useMemo<DataTableContextValue<TData>>(
    () => ({
      state,
      dispatch: dispatchWithCallbacks,
      table: table as Table<TData>,
      config,
      computed,
      fields,
    }),
    [state, dispatchWithCallbacks, table, config, computed, fields],
  );

  return (
    <DataTableContext.Provider
      value={contextValue as DataTableContextValue<unknown>}
    >
      {children}
    </DataTableContext.Provider>
  );
}

// Export the context for use in hooks.ts
export { DataTableContext };
