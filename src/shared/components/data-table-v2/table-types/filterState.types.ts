/**
 * Filter State Types
 *
 * PURPOSE: Define the shape of filter/query state for the DataTable.
 *
 * WHAT IS A FILTER?
 * A filter is a set of rules like:
 *   - "name contains 'John'"
 *   - "age > 25 AND status = 'active'"
 *
 * We use react-querybuilder's RuleGroupType format because:
 *   1. It's a standard format understood by many tools
 *   2. It can be converted to SQL, MongoDB, JSON Logic, etc.
 *   3. It supports nested groups (AND/OR combinations)
 */

import type { RuleGroupType } from "react-querybuilder";

// ============================================================================
// Type Definition
// ============================================================================

/**
 * The filter state is a RuleGroupType from react-querybuilder.
 *
 * Structure example:
 * {
 *   combinator: "and",        // How to combine rules: "and" | "or"
 *   rules: [
 *     { field: "name", operator: "contains", value: "John" },
 *     { field: "age", operator: ">", value: 25 }
 *   ]
 * }
 */
export type FilterQueryState = RuleGroupType;

// ============================================================================
// Default Value
// ============================================================================

/**
 * Empty filter query - no filters applied.
 *
 * WHY Object.freeze?
 * Prevents accidental mutation. This is a constant that should never change.
 */
export const EMPTY_FILTER_QUERY: FilterQueryState = Object.freeze({
  combinator: "and",
  rules: [],
});

// ============================================================================
// Type Guard
// ============================================================================

/**
 * Check if a value is a valid FilterQueryState.
 *
 * WHEN TO USE:
 * - When parsing data from URL
 * - When receiving data from external sources
 * - When you need runtime type checking
 *
 * @param value - Any value to check
 * @returns true if value is a valid filter query
 */
export function isFilterQueryState(value: unknown): value is FilterQueryState {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;

  // Must have combinator (string)
  if (typeof obj.combinator !== "string") {
    return false;
  }

  // Must have rules (array)
  if (!Array.isArray(obj.rules)) {
    return false;
  }

  return true;
}
