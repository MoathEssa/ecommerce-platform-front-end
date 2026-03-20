/**
 * Pagination State Types
 *
 * PURPOSE: Define the shape of pagination state for the DataTable.
 *
 * WHAT IS PAGINATION STATE?
 * It describes which "page" of data to show and how many rows per page.
 *
 * Example: Show page 2 with 20 rows per page
 * {
 *   pageIndex: 1,   // 0-indexed! Page 2 = index 1
 *   pageSize: 20
 * }
 *
 * WHY 0-INDEXED?
 * TanStack Table uses 0-indexed pages internally.
 * pageIndex: 0 = First page
 * pageIndex: 1 = Second page
 */

import type { PaginationState as TanStackPaginationState } from "@tanstack/react-table";

// ============================================================================
// Type Definition
// ============================================================================

/**
 * Pagination state shape.
 *
 * - pageIndex: Current page (0-indexed)
 * - pageSize: Number of rows per page
 *
 * We re-export TanStack's type for compatibility.
 */
export type PaginationState = TanStackPaginationState;

// ============================================================================
// Default Values
// ============================================================================

/**
 * Default page size options for the page size selector.
 */
export const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

/**
 * Default pagination - first page, 10 rows.
 */
export const DEFAULT_PAGINATION: PaginationState = Object.freeze({
  pageIndex: 0,
  pageSize: 10,
});

// ============================================================================
// Type Guard
// ============================================================================

/**
 * Check if a value is a valid PaginationState.
 *
 * WHEN TO USE:
 * - When parsing pagination from URL
 * - When receiving data from external sources
 *
 * @param value - Any value to check
 * @returns true if value is a valid pagination state
 */
export function isPaginationState(value: unknown): value is PaginationState {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;

  // pageIndex must be a non-negative number
  if (typeof obj.pageIndex !== "number" || obj.pageIndex < 0) {
    return false;
  }

  // pageSize must be a positive number
  if (typeof obj.pageSize !== "number" || obj.pageSize < 1) {
    return false;
  }

  return true;
}
