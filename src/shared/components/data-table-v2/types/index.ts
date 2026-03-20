/**
 * DataTableV2 Types
 * Comprehensive type definitions for the data table component
 */

import type {
  ColumnDef,
  SortingState,
  VisibilityState,
  RowSelectionState,
} from "@tanstack/react-table";
import type { RuleGroupType, Field } from "react-querybuilder";
import type { RulesLogic as RuleJsonLogic } from "json-logic-js";

// ============================================================================
// Field Variants & Operators
// ============================================================================

/**
 * Supported field/filter variants
 */
export type FieldVariant =
  | "text"
  | "number"
  | "date"
  | "dateRange"
  | "select"
  | "multiSelect"
  | "boolean"
  | "range";

/**
 * Option type for select/multiSelect fields
 */
export interface SelectOption {
  label: string;
  value: string | number;
  icon?: React.FC<{ className?: string }>;
}

// ============================================================================
// Column Meta Extension
// ============================================================================

/**
 * Extended column meta for DataTableV2
 * Provides additional metadata for filtering, display, and behavior
 */
export interface DataTableColumnMeta {
  /** Display label for the column */
  label?: string;
  /** Placeholder text for filter inputs */
  placeholder?: string;
  /** Filter variant determining the type of filter UI */
  variant?: FieldVariant;
  /** Options for select/multiSelect variants */
  options?: SelectOption[];
  /** Range bounds for number/range variants [min, max] */
  range?: [number, number];
  /** Unit label for number/range fields (e.g., "kg", "km") */
  unit?: string;
  /** Icon component for the column header */
  icon?: React.FC<{ className?: string }>;
  /** Whether this column should be filterable */
  filterable?: boolean;
  /** Whether this column should be sortable */
  sortable?: boolean;
  /** Whether this column should be visible by default */
  defaultVisible?: boolean;
  /** Custom date format for date fields */
  dateFormat?: string;
}

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * Filter mode determines where filtering logic is executed
 */
export type FilterMode = "client" | "server" | "none";

/**
 * Pagination mode determines where pagination is handled
 */
export type PaginationMode = "client" | "server";

/**
 * Sorting mode determines where sorting is handled
 */
export type SortingMode = "client" | "server";

/**
 * Export format types
 */
export type ExportFormat =
  | "jsonLogic"
  | "sql"
  | "mongodb"
  | "json"
  | "csv"
  | "excel";

/**
 * Query export format types (filter state formats)
 */
export type QueryExportFormat = "jsonLogic" | "sql" | "mongodb" | "json";

/**
 * Data export format types (table data formats)
 */
export type DataExportFormat = "csv" | "excel" | "json";

/**
 * Main configuration interface for DataTableV2
 */
export interface DataTableV2Config<TData> {
  // ========== Filter Configuration ==========
  /** Where filtering is executed */
  filterMode?: FilterMode;
  /** Enable advanced query builder filter */
  enableAdvancedFilter?: boolean;
  /** Enable simple single-column filter */
  enableSimpleFilter?: boolean;
  /** Debounce delay for filter changes (ms) */
  filterDebounceMs?: number;

  // ========== Export Configuration ==========
  /** Enable export functionality */
  enableExport?: boolean;
  /** Available query export formats */
  queryExportFormats?: QueryExportFormat[];
  /** Available data export formats */
  dataExportFormats?: DataExportFormat[];

  // ========== Pagination Configuration ==========
  /** Enable pagination */
  enablePagination?: boolean;
  /** Where pagination is handled */
  paginationMode?: PaginationMode;
  /** Default page size */
  defaultPageSize?: number;
  /** Available page size options */
  pageSizeOptions?: number[];
  /** Total row count (required for server pagination) */
  totalRowCount?: number;

  // ========== Selection Configuration ==========
  /** Enable row selection */
  enableRowSelection?: boolean;
  /** Selection mode */
  selectionMode?: "single" | "multi";
  /** Callback when selection changes */
  onSelectionChange?: (selectedRows: TData[]) => void;

  // ========== Column Configuration ==========
  /** Enable column resizing */
  enableColumnResizing?: boolean;
  /** Enable column reordering */
  enableColumnReordering?: boolean;
  /** Enable column pinning */
  enableColumnPinning?: boolean;
  /** Enable column visibility toggle */
  enableColumnVisibility?: boolean;

  // ========== Display Configuration ==========
  /** Display mode */
  displayMode?: "flat" | "tree";
  /** Enable virtual scrolling for large datasets */
  enableVirtualization?: boolean;
  /** Estimated row height for virtualization */
  estimatedRowHeight?: number;

  // ========== Sorting Configuration ==========
  /** Enable sorting */
  enableSorting?: boolean;
  /** Enable multi-column sorting */
  enableMultiSort?: boolean;
  /** Where sorting is handled */
  sortingMode?: SortingMode;
  /** Maximum number of sort columns */
  maxSortColumns?: number;

  // ========== Server-Side Callbacks ==========
  /** Callback when filters change (server mode) */
  onFilterChange?: (
    query: RuleGroupType,
    jsonLogic: RuleJsonLogic | null,
  ) => void;
  /** Callback when sorting changes (server mode) */
  onSortChange?: (sorting: SortingState) => void;
  /** Callback when pagination changes (server mode) */
  onPaginationChange?: (pagination: PaginationState) => void;

  // ========== Loading & Empty States ==========
  /** Loading state indicator */
  isLoading?: boolean;
  /** Custom loading component */
  loadingComponent?: React.ReactNode;
  /** Custom empty state component */
  emptyStateComponent?: React.ReactNode;

  // ========== Customization Slots ==========
  /** Custom toolbar content (rendered before default toolbar items) */
  toolbarStartSlot?: React.ReactNode;
  /** Custom toolbar content (rendered after default toolbar items) */
  toolbarEndSlot?: React.ReactNode;
  /** Custom action buttons for selected rows */
  selectionActions?: React.ReactNode;
}

// ============================================================================
// State Types
// ============================================================================

/**
 * Pagination state
 */
export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

/**
 * Complete table state
 */
export interface DataTableState {
  query: RuleGroupType;
  sorting: SortingState;
  pagination: PaginationState;
  columnVisibility: VisibilityState;
  rowSelection: RowSelectionState;
}

/**
 * Simple filter state for quick single-column filtering
 */
export interface SimpleFilterState {
  columnId: string;
  value: string | number | boolean | (string | number)[];
  variant: FieldVariant;
}

// ============================================================================
// Props Types
// ============================================================================

/**
 * Main DataTableV2 component props
 */
export interface DataTableV2Props<TData> {
  /** Table data array */
  data: TData[];
  /** Column definitions with extended meta */
  columns: ColumnDef<TData, unknown>[];
  /** Configuration options */
  config?: DataTableV2Config<TData>;
  /** Initial query state */
  defaultQuery?: RuleGroupType;
  /** Initial sorting state */
  defaultSorting?: SortingState;
  /** Initial pagination state */
  defaultPagination?: PaginationState;
  /** Initial column visibility */
  defaultColumnVisibility?: VisibilityState;
  /** Unique identifier field in data */
  getRowId?: (row: TData) => string;
  /** Children node for tree display mode */
  getSubRows?: (row: TData) => TData[] | undefined;
  /** Callback for add new item action */
  onAddNewItem?: () => void;
  /** Tooltip message for add button */
  addNewTooltipMessage?: string;
  /** Table caption for accessibility */
  caption?: string;
  /** Additional CSS class */
  className?: string;
}

// ============================================================================
// Hook Return Types
// ============================================================================

/**
 * Return type for useDataTableV2 hook
 */
export interface UseDataTableV2Return<TData> {
  /** TanStack Table instance */
  table: import("@tanstack/react-table").Table<TData>;
  /** Current filter query */
  query: RuleGroupType;
  /** Set filter query */
  setQuery: (query: RuleGroupType) => void;
  /** Current JSON Logic representation */
  jsonLogic: RuleJsonLogic | null;
  /** Export query in specified format */
  exportQuery: (format: QueryExportFormat) => string | object;
  /** Export data in specified format */
  exportData: (format: DataExportFormat, options?: DataExportOptions) => void;
  /** Reset all filters */
  resetFilters: () => void;
  /** Reset all state (filters, sorting, pagination) */
  resetAll: () => void;
  /** Whether any filters are active */
  hasActiveFilters: boolean;
  /** Count of active filter rules */
  activeFilterCount: number;
  /** Loading state */
  isLoading: boolean;
  /** Filtered data (client mode only) */
  filteredData: TData[];
  /** Selected rows */
  selectedRows: TData[];
}

/**
 * Options for data export
 */
export interface DataExportOptions {
  /** Export only selected rows */
  selectedOnly?: boolean;
  /** Export only visible columns */
  visibleColumnsOnly?: boolean;
  /** Custom filename */
  filename?: string;
  /** Include headers in export */
  includeHeaders?: boolean;
}

// ============================================================================
// React Query Builder Field Extension
// ============================================================================

/**
 * Extended field type for react-querybuilder
 */
export interface DataTableField extends Field {
  /** Field variant for determining filter UI */
  variant: FieldVariant;
  /** Options for select/multiSelect */
  selectOptions?: SelectOption[];
  /** Range for number/range fields */
  numberRange?: [number, number];
  /** Unit for number fields */
  unit?: string;
  /** Date format */
  dateFormat?: string;
}

// ============================================================================
// Module Augmentation for TanStack Table
// ============================================================================

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    /** Display label for the column */
    label?: string;
    /** Placeholder text for filter inputs */
    placeholder?: string;
    /** Filter variant determining the type of filter UI */
    variant?: FieldVariant;
    /** Options for select/multiSelect filter variants */
    filterOptions?: SelectOption[];
    /** Range bounds for number/range variants [min, max] */
    range?: [number, number];
    /** Unit label for number/range fields (e.g., "kg", "km") */
    unit?: string;
    /** Whether this column should be filterable */
    filterable?: boolean;
    /** Whether this column should be sortable */
    sortable?: boolean;
    /** Whether this column should be visible by default */
    defaultVisible?: boolean;
    /** Custom date format for date fields */
    dateFormat?: string;
  }
}

// Re-export commonly used types from dependencies
export type {
  RuleGroupType,
  RuleType,
  Field,
  FullOperator,
} from "react-querybuilder";
export type {
  SortingState,
  VisibilityState,
  RowSelectionState,
  ColumnDef,
} from "@tanstack/react-table";
export type { RulesLogic } from "json-logic-js";
