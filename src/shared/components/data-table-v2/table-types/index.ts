/**
 * Table Types - Barrel Export
 *
 * PURPOSE: Single entry point for all table state types.
 *
 * HOW TO USE:
 * Instead of importing from individual files:
 *   import { FilterQueryState } from "./table-types/filterState.types";
 *   import { SortingState } from "./table-types/sortingState.types";
 *
 * You can import everything from here:
 *   import { FilterQueryState, SortingState, DataTableState } from "./table-types";
 */

// ============================================================================
// Filter State
// ============================================================================

export {
  type FilterQueryState,
  EMPTY_FILTER_QUERY,
  isFilterQueryState,
} from "./filterState.types";

// ============================================================================
// Sorting State
// ============================================================================

export {
  type SortingColumn,
  type SortingState,
  EMPTY_SORTING,
  isSortingState,
} from "./sortingState.types";

// ============================================================================
// Pagination State
// ============================================================================

export {
  type PaginationState,
  DEFAULT_PAGE_SIZE_OPTIONS,
  DEFAULT_PAGINATION,
  isPaginationState,
} from "./paginationState.types";

// ============================================================================
// Column Visibility State
// ============================================================================

export {
  type ColumnVisibilityState,
  EMPTY_COLUMN_VISIBILITY,
  isColumnVisibilityState,
} from "./columnVisibility.types";

// ============================================================================
// Row Selection State
// ============================================================================

export {
  type RowSelectionState,
  EMPTY_ROW_SELECTION,
  isRowSelectionState,
} from "./rowSelection.types";

// ============================================================================
// Combined State (Master Type)
// ============================================================================

export {
  type DataTableState,
  DEFAULT_TABLE_STATE,
} from "./combinedState.types";
