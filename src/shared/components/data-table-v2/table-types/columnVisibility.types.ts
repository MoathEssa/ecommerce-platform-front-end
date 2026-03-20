/**
 * Column Visibility State Types
 *
 * PURPOSE: Define which columns are visible or hidden in the DataTable.
 *
 * WHAT IS COLUMN VISIBILITY STATE?
 * A simple map: column ID → visible (true/false)
 *
 * Example: Hide "email" and "phone" columns
 * {
 *   "email": false,
 *   "phone": false
 * }
 *
 * HOW IT WORKS:
 * - If a column is NOT in the object → it's VISIBLE (default)
 * - If a column is set to false → it's HIDDEN
 * - If a column is set to true → it's VISIBLE (explicit)
 */

import type { VisibilityState as TanStackVisibilityState } from "@tanstack/react-table";

// ============================================================================
// Type Definition
// ============================================================================

/**
 * Column visibility state.
 *
 * Key: column ID
 * Value: true = visible, false = hidden
 *
 * Missing key = visible (default behavior)
 */
export type ColumnVisibilityState = TanStackVisibilityState;

// ============================================================================
// Default Value
// ============================================================================

/**
 * Empty visibility state - all columns visible by default.
 *
 * Empty object means "use default visibility for all columns"
 */
export const EMPTY_COLUMN_VISIBILITY: ColumnVisibilityState = Object.freeze({});

// ============================================================================
// Type Guard
// ============================================================================

/**
 * Check if a value is a valid ColumnVisibilityState.
 *
 * WHEN TO USE:
 * - When parsing visibility from URL
 * - When receiving data from external sources
 *
 * @param value - Any value to check
 * @returns true if value is a valid column visibility state
 */
export function isColumnVisibilityState(
  value: unknown,
): value is ColumnVisibilityState {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  // All values must be booleans
  return Object.values(value).every((v) => typeof v === "boolean");
}
