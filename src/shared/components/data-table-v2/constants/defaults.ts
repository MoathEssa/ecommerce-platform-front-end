import type { RuleGroupType } from "react-querybuilder";
import type { SortingState, PaginationState, VisibilityState } from "../types";
import type { DataTableState, DataTableContextConfig } from "../context/types";

// ============================================================================
// Default State Values
// ============================================================================


export const DEFAULT_QUERY: RuleGroupType = {
  combinator: "and",
  rules: [],
};


export const DEFAULT_SORTING: SortingState = [];


export const DEFAULT_PAGINATION: PaginationState = {
  pageIndex: 0,
  pageSize: 10,
};


export const DEFAULT_COLUMN_VISIBILITY: VisibilityState = {};


export const DEFAULT_ROW_SELECTION: Record<string, boolean> = {};


export const DEFAULT_STATE: DataTableState = {
  query: DEFAULT_QUERY,
  sorting: DEFAULT_SORTING,
  pagination: DEFAULT_PAGINATION,
  columnVisibility: DEFAULT_COLUMN_VISIBILITY,
  rowSelection: DEFAULT_ROW_SELECTION,
  globalFilter: "",
  isFilterPanelOpen: false,
};


export const DEFAULT_CONFIG: DataTableContextConfig = {
  initialQuery: DEFAULT_QUERY,
  initialSorting: DEFAULT_SORTING,
  initialPagination: DEFAULT_PAGINATION,
  initialColumnVisibility: DEFAULT_COLUMN_VISIBILITY,
  defaultPageSize: 10,
  enableAdvancedFilter: true,
  filterMode: "client",
};


export const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;


export const DEFAULT_PAGE_SIZE = 10;


export const DEFAULT_LABELS = {
  filter: "Filter",
  clearFilters: "Clear filters",
  columns: "Columns",
  search: "Search...",

  noResults: "No results found.",
  loading: "Loading...",

  rowsPerPage: "Rows per page",
  page: "Page",
  of: "of",
  firstPage: "First page",
  previousPage: "Previous page",
  nextPage: "Next page",
  lastPage: "Last page",
  showing: "Showing {{start}}-{{end}} of {{total}}",
  selected: "{{count}} selected",

  toggleColumns: "Toggle columns",
  showAll: "Show all",
  hideAll: "Hide all",

  addRule: "+ Rule",
  addGroup: "+ Group",
  removeRule: "Remove rule",
  removeGroup: "Remove group",
  selectField: "Select field...",
  selectOperator: "Select operator...",
  enterValue: "Enter value...",
} as const;


export const ANIMATION_DURATIONS = {
  filterPanel: 200,
  rowHover: 150,
  skeleton: 1000,
} as const;


export const DEBOUNCE_DELAYS = {
  globalFilter: 300,
  filterChange: 300,
  columnResize: 100,
} as const;
