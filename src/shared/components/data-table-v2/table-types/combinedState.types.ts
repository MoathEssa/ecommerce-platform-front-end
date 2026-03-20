/**
 * Combined State Types
 *
 * PURPOSE: Combine all individual state types into ONE unified DataTableState.
 *
 * WHY COMBINE?
 * When you need to pass "the entire table state" somewhere:
 * - Save to localStorage
 * - Sync to URL
 * - Pass to context provider
 * - Reset all state at once
 *
 * This file imports from all other state files and creates the "master" type.
 */

import { type FilterQueryState, EMPTY_FILTER_QUERY } from "./filterState.types";

import { type SortingState, EMPTY_SORTING } from "./sortingState.types";

import {
  type PaginationState,
  DEFAULT_PAGINATION,
} from "./paginationState.types";

import {
  type ColumnVisibilityState,
  EMPTY_COLUMN_VISIBILITY,
} from "./columnVisibility.types";

import {
  type RowSelectionState,
  EMPTY_ROW_SELECTION,
} from "./rowSelection.types";

// ============================================================================
// Combined State Type
// ============================================================================

/**
 * Complete DataTable state.
 *
 * This is the "master" type that holds ALL table state in one object.
 *
 * Example:
 * {
 *   filter: { combinator: "and", rules: [...] },
 *   sorting: [{ id: "name", desc: false }],
 *   pagination: { pageIndex: 0, pageSize: 10 },
 *   columnVisibility: { email: false },
 *   rowSelection: { "row-1": true }
 * }
 */
export interface DataTableState {
  /** Current filter/query rules */
  readonly filter: FilterQueryState;

  /** Current sorting configuration */
  readonly sorting: SortingState;

  /** Current pagination (page index + page size) */
  readonly pagination: PaginationState;

  /** Which columns are visible/hidden */
  readonly columnVisibility: ColumnVisibilityState;

  /** Which rows are selected */
  readonly rowSelection: RowSelectionState;
}

// ============================================================================
// Default Combined State
// ============================================================================

/**
 * Default state - everything empty/default.
 *
 * Use this as initial state when creating a new table.
 */
export const DEFAULT_TABLE_STATE: DataTableState = Object.freeze({
  filter: EMPTY_FILTER_QUERY,
  sorting: EMPTY_SORTING,
  pagination: DEFAULT_PAGINATION,
  columnVisibility: EMPTY_COLUMN_VISIBILITY,
  rowSelection: EMPTY_ROW_SELECTION,
});

// ============================================================================
// Re-export individual types for convenience
// ============================================================================

export type {
  FilterQueryState,
  SortingState,
  PaginationState,
  ColumnVisibilityState,
  RowSelectionState,
};
