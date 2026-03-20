import type { Table } from "@tanstack/react-table";
import type { RuleGroupType } from "react-querybuilder";
import type { SortingState, PaginationState, VisibilityState } from "../types";

// ============================================================================
// State Types
// ============================================================================

export interface DataTableState {
  /** Query builder filter state */
  query: RuleGroupType;
  /** Sorting state */
  sorting: SortingState;
  /** Pagination state */
  pagination: PaginationState;
  /** Column visibility state */
  columnVisibility: VisibilityState;
  /** Row selection state */
  rowSelection: Record<string, boolean>;
  /** Global filter (quick search) value */
  globalFilter: string;
  /** Whether filter panel is open */
  isFilterPanelOpen: boolean;
}

export type DataTableAction =
  | { type: "SET_QUERY"; payload: RuleGroupType }
  | { type: "SET_SORTING"; payload: SortingState }
  | { type: "SET_PAGINATION"; payload: PaginationState }
  | { type: "SET_PAGE_INDEX"; payload: number }
  | { type: "SET_PAGE_SIZE"; payload: number }
  | { type: "SET_GLOBAL_FILTER"; payload: string }
  | { type: "SET_COLUMN_VISIBILITY"; payload: VisibilityState }
  | {
      type: "TOGGLE_COLUMN_VISIBILITY";
      payload: { columnId: string; visible: boolean };
    }
  | { type: "SET_ROW_SELECTION"; payload: Record<string, boolean> }
  | { type: "TOGGLE_ROW_SELECTION"; payload: string }
  | { type: "SELECT_ALL_ROWS"; payload: boolean }
  | { type: "TOGGLE_FILTER_PANEL" }
  | { type: "OPEN_FILTER_PANEL" }
  | { type: "CLOSE_FILTER_PANEL" }
  | { type: "RESET_FILTERS" }
  | { type: "RESET_SORTING" }
  | { type: "RESET_PAGINATION" }
  | { type: "RESET_COLUMN_VISIBILITY" }
  | { type: "RESET_ROW_SELECTION" }
  | { type: "RESET_ALL" };

export interface DataTableContextConfig {
  initialQuery?: RuleGroupType;
  initialSorting?: SortingState;
  initialPagination?: PaginationState;
  initialColumnVisibility?: VisibilityState;
  defaultPageSize?: number;
  enableAdvancedFilter?: boolean;
  filterMode?: "client" | "server";
}

export interface DataTableContextValue<TData> {
  state: DataTableState;
  dispatch: React.Dispatch<DataTableAction>;
  table: Table<TData>;
  config: DataTableContextConfig;
  computed: {
    isFiltering: boolean;
    activeFilterCount: number;
    pageCount: number;
    selectedRows: TData[];
    processedData: TData[];
  };
  fields: Array<{
    name: string;
    label: string;
    variant?:
      | "text"
      | "number"
      | "date"
      | "dateRange"
      | "select"
      | "multiSelect"
      | "boolean"
      | "range";
  }>;
}

export interface UseDataTableStateReturn {
  state: DataTableState;
  dispatch: React.Dispatch<DataTableAction>;
  actions: {
    setQuery: (query: RuleGroupType) => void;
    setSorting: (sorting: SortingState) => void;
    setPagination: (pagination: PaginationState) => void;
    setPageIndex: (index: number) => void;
    setPageSize: (size: number) => void;
    setGlobalFilter: (filter: string) => void;
    setColumnVisibility: (visibility: VisibilityState) => void;
    setRowSelection: (selection: Record<string, boolean>) => void;
    toggleFilterPanel: () => void;
    resetFilters: () => void;
    resetSorting: () => void;
    resetPagination: () => void;
    resetAll: () => void;
  };
}
