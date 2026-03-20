/**
 * DataTableV2 - Advanced Data Table with Query Builder Filtering
 *
 * Features:
 * - React Query Builder for advanced filtering UI
 * - JSON Logic for client-side filter evaluation
 * - Support for server-side filtering (exports query as SQL, MongoDB, etc.)
 * - URL state synchronization via nuqs
 * - TanStack Table for virtualized table rendering
 * - CSV/Excel/JSON data export
 * - Context-based state management (new!)
 * - Modular hooks for filtering, pagination, sorting, selection (new!)
 *
 * @example
 * ```tsx
 * import { DataTableV2, useDataTableV2 } from '@/shared/components/data-table-v2';
 *
 * // Simple usage (legacy)
 * <DataTableV2 data={data} columns={columns} />
 *
 * // New context-based usage (recommended for complex scenarios)
 * <DataTableV2WithContext data={data} columns={columns} />
 *
 * // Composable usage with context
 * <DataTableProvider data={data} columns={columns}>
 *   <MyCustomToolbar />
 *   <DataTableCore table={useDataTable()} />
 *   <Pagination table={useDataTable()} />
 * </DataTableProvider>
 *
 * // With server-side filtering
 * <DataTableV2
 *   data={data}
 *   columns={columns}
 *   filterMode="server"
 *   onFilterChange={(query) => {
 *     const sql = toSql(query);
 *     refetch({ where: sql });
 *   }}
 * />
 * ```
 */

// ============================================================================
// Main Components
// ============================================================================

// Context-based component (recommended)
export {
  DataTableV2WithContext,
  type DataTableV2WithContextProps,
} from "./DataTableV2WithContext";

// Re-export as DataTableV2 for backwards compatibility
export { DataTableV2WithContext as DataTableV2 } from "./DataTableV2WithContext";
export type { DataTableV2WithContextProps as DataTableV2Props } from "./DataTableV2WithContext";

// ============================================================================
// Context (for composable usage)
// ============================================================================

export {
  // Provider
  DataTableProvider,
  type DataTableProviderProps,
  // Hooks
  useDataTableContext,
  useDataTable,
  useDataTableState,
  useDataTableDispatch,
  useDataTableComputed,
  useDataTableFields,
  useDataTableConfig,
  // Reducer
  dataTableReducer,
  createInitialState,
  // Types
  type DataTableState,
  type DataTableAction,
  type DataTableContextValue,
  type DataTableContextConfig,
} from "./context";

// ============================================================================
// Hooks
// ============================================================================

// Legacy hooks (still supported)
export {
  useDataTableV2,
  type UseDataTableV2Options,
  type UseDataTableV2Return,
} from "./hooks";

// New modular hooks
export {
  useTableFiltering,
  useTablePagination,
  useTableSorting,
  useTableSelection,
  useDebouncedValue,
  useDebouncedCallback,
  type UseTableFilteringOptions,
  type UseTableFilteringReturn,
  type UseTablePaginationOptions,
  type UseTablePaginationReturn,
  type UseTableSortingOptions,
  type UseTableSortingReturn,
  type UseTableSelectionOptions,
  type UseTableSelectionReturn,
} from "./hooks";

// ============================================================================
// Sub-Components (for composition)
// ============================================================================

export {
  // Error handling
  DataTableErrorBoundary,
  createDataTableErrorHandler,
  type DataTableErrorBoundaryProps,
  // States
  EmptyState,
  LoadingState,
  TableLoadingBody,
  type EmptyStateProps,
  type LoadingStateProps,
  // Toolbar components
  Toolbar,
  QuickSearch,
  FilterButton,
  ColumnVisibilityDropdown,
  type ToolbarProps,
  type QuickSearchProps,
  type FilterButtonProps,
  type ColumnVisibilityDropdownProps,
} from "./components";

// ============================================================================
// UI Components
// ============================================================================

export {
  DataTableCore,
  ColumnHeader,
  Pagination,
  ColumnVisibility,
  type DataTableCoreProps,
  type ColumnHeaderProps,
  type PaginationProps,
  type ColumnVisibilityProps,
} from "./ui";

// ============================================================================
// Filters
// ============================================================================

export {
  QueryBuilderFilter,
  type QueryBuilderFilterProps,
} from "./filters/QueryBuilderFilter";
export { SimpleFilter, type SimpleFilterProps } from "./filters/SimpleFilter";
export { generateFieldsFromColumns } from "./filters/fieldConfig";
export {
  allOperators,
  extendedOperators,
  getOperatorsForVariant,
  relativeDateOptions,
  getRelativeDateRange,
} from "./filters/operatorConfig";

// Query Builder UI components (for custom query builders)
export {
  CombinatorSelector,
  FieldSelector,
  OperatorSelector,
  ValueSelector,
  ValueEditor,
  AddRuleAction,
  AddGroupAction,
  RemoveRuleAction,
  RemoveGroupAction,
  CloneRuleAction,
  CloneGroupAction,
  DragHandle,
} from "./filters/QueryBuilderFilter/components";

// ============================================================================
// Types
// ============================================================================

export type {
  DataTableV2Config,
  FilterMode,
  DataTableColumnMeta,
  FieldVariant,
} from "./types";
export { defaultConfig, mergeConfig } from "./types/config";

// ============================================================================
// Constants
// ============================================================================

export {
  DEFAULT_QUERY,
  DEFAULT_SORTING,
  DEFAULT_PAGINATION,
  DEFAULT_COLUMN_VISIBILITY,
  DEFAULT_ROW_SELECTION,
  DEFAULT_STATE,
  DEFAULT_CONFIG,
  DEFAULT_PAGE_SIZE_OPTIONS,
  DEFAULT_PAGE_SIZE,
  DEFAULT_LABELS,
  DEBOUNCE_DELAYS,
  ANIMATION_DURATIONS,
} from "./constants";

// ============================================================================
// Filter Engine & Converters
// ============================================================================

export {
  // Filter application
  queryToJsonLogic,
  applyJsonLogic,
  filterWithJsonLogic,
  applyFilter,
  rowMatchesFilter,
  createTableFilterFn,
  type FilterEngineOptions,
  // Query export (formatQuery wrappers)
  exportQuery,
  toJsonLogic,
  toSql,
  toParameterizedSql,
  toMongoDB,
  toCEL,
  toSpEL,
  toElasticSearch,
  toNaturalLanguage,
  type ExportFormat,
  type ExportOptions,
} from "./engine";

// ============================================================================
// Data Export
// ============================================================================

export {
  toCSV,
  exportToCSV,
  exportToJSON,
  exportToExcel,
  createExportHandlers,
  type ExportColumn,
  type DataExportOptions,
} from "./exports";

// ============================================================================
// Selection Column Helper
// ============================================================================

export {
  createSelectionColumn,
  type SelectionColumnOptions,
} from "./utils/createSelectionColumn";
