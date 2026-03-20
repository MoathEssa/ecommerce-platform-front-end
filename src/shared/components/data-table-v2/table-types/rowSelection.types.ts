/**
 * Row Selection State Types
 *
 * PURPOSE: Define which rows are selected in the DataTable.
 *
 * WHAT IS ROW SELECTION STATE?
 * A map: row ID → selected (true/false)
 *
 * Example: Select rows with IDs "row-1" and "row-3"
 * {
 *   "row-1": true,
 *   "row-3": true
 * }
 *
 * USE CASES:
 * - Bulk delete selected items
 * - Bulk export selected items
 * - Bulk status change
 * - "Select all" checkbox in header
 */

import type { RowSelectionState as TanStackRowSelectionState } from "@tanstack/react-table";

// ============================================================================
// Type Definition
// ============================================================================

/**
 * Row selection state.
 *
 * Key: row ID (usually from your data's unique identifier)
 * Value: true = selected, false/missing = not selected
 */
export type RowSelectionState = TanStackRowSelectionState;

// ============================================================================
// Default Value
// ============================================================================

/**
 * Empty selection state - no rows selected.
 */
export const EMPTY_ROW_SELECTION: RowSelectionState = Object.freeze({});

// ============================================================================
// Type Guard
// ============================================================================

/**
 * Check if a value is a valid RowSelectionState.
 *
 * WHEN TO USE:
 * - When parsing selection from URL (if you sync selection to URL)
 * - When receiving data from external sources
 *
 * @param value - Any value to check
 * @returns true if value is a valid row selection state
 */
export function isRowSelectionState(
  value: unknown,
): value is RowSelectionState {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  // All values must be booleans
  return Object.values(value).every((v) => typeof v === "boolean");
}
