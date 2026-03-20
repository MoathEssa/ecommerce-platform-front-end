/**
 * Hooks exports
 */

// Main hooks (legacy - kept for backward compatibility)
export {
  useDataTableV2,
  type UseDataTableV2Options,
  type UseDataTableV2Return,
} from "./useDataTableV2";

// New modular hooks
export {
  useTableFiltering,
  type UseTableFilteringOptions,
  type UseTableFilteringReturn,
} from "./useTableFiltering";

export {
  useTablePagination,
  type UseTablePaginationOptions,
  type UseTablePaginationReturn,
} from "./useTablePagination";

export {
  useTableSorting,
  type UseTableSortingOptions,
  type UseTableSortingReturn,
} from "./useTableSorting";

export {
  useTableSelection,
  type UseTableSelectionOptions,
  type UseTableSelectionReturn,
} from "./useTableSelection";

export {
  useDebouncedValue,
  useDebouncedCallback,
  type UseDebouncedValueOptions,
} from "./useDebouncedValue";
