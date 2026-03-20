/**
 * Sorting State Types
 *
 * PURPOSE: Define the shape of sorting state for the DataTable.
 *
 * WHAT IS SORTING STATE?
 * It describes which columns are sorted and in what direction.
 *
 * Example: Sort by "name" ascending, then by "age" descending
 * [
 *   { id: "name", desc: false },   // ascending
 *   { id: "age", desc: true }      // descending
 * ]
 *
 * WHY AN ARRAY?
 * To support multi-column sorting. First item = primary sort, second = secondary, etc.
 */

import type { SortingState as TanStackSortingState } from "@tanstack/react-table";

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * A single column's sort configuration.
 *
 * - id: The column identifier
 * - desc: true = descending (Z→A, 9→1), false = ascending (A→Z, 1→9)
 */
export interface SortingColumn {
  readonly id: string;
  readonly desc: boolean;
}

/**
 * Complete sorting state - an array of sorted columns.
 *
 * We re-export TanStack's type for compatibility, but define our own
 * interface for documentation and potential future customization.
 */
export type SortingState = TanStackSortingState;

// ============================================================================
// Default Value
// ============================================================================

/**
 * Empty sorting - no columns sorted.
 *
 * WHY Object.freeze?
 * Prevents accidental mutation. Empty array should never change.
 */
export const EMPTY_SORTING: SortingState = Object.freeze(
  [],
) as unknown as SortingState;

// ============================================================================
// Type Guard
// ============================================================================

/**
 * Check if a value is a valid SortingState.
 *
 * WHEN TO USE:
 * - When parsing sorting from URL
 * - When receiving data from external sources
 *
 * @param value - Any value to check
 * @returns true if value is a valid sorting state
 */
export function isSortingState(value: unknown): value is SortingState {
  // Must be an array
  if (!Array.isArray(value)) {
    return false;
  }

  // Each item must have id (string) and desc (boolean)
  return value.every(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      typeof item.id === "string" &&
      typeof item.desc === "boolean",
  );
}
