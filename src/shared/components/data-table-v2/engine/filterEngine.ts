/**
 * Filter Engine for DataTableV2
 * Uses react-querybuilder's formatQuery for JSON Logic conversion
 * and json-logic-js for client-side filter application
 */

import type { RuleGroupType } from "react-querybuilder";
import type { RulesLogic } from "json-logic-js";
import jsonLogic from "json-logic-js";
import { toJsonLogic, registerJsonLogicOperators } from "./converters";

// Ensure JSON Logic operators are registered on import
registerJsonLogicOperators();

// ============================================================================
// Type Definitions
// ============================================================================

export interface FilterEngineOptions {
  /** Parse number strings to numbers */
  parseNumbers?: boolean;
}

// ============================================================================
// Query to JSON Logic Conversion
// ============================================================================

/**
 * Convert react-querybuilder query to JSON Logic format
 * Uses formatQuery with custom rule processor for extended operators
 */
export function queryToJsonLogic(query: RuleGroupType): RulesLogic | null {
  // Return null for empty queries
  if (!query.rules || query.rules.length === 0) {
    return null;
  }

  try {
    const result = toJsonLogic(query);
    return result as RulesLogic;
  } catch (error) {
    console.error("Error converting query to JSON Logic:", error);
    return null;
  }
}

// ============================================================================
// Filter Application (Client-Side)
// ============================================================================

/**
 * Apply JSON Logic rule to a single data row
 */
export function applyJsonLogic<TData extends Record<string, unknown>>(
  logic: RulesLogic,
  data: TData,
): boolean {
  try {
    return Boolean(jsonLogic.apply(logic, data));
  } catch (error) {
    console.error("Error applying JSON Logic:", error);
    return true;
  }
}

/**
 * Filter data array using JSON Logic
 */
export function filterWithJsonLogic<TData extends Record<string, unknown>>(
  data: TData[],
  logic: RulesLogic,
): TData[] {
  return data.filter((row) => applyJsonLogic(logic, row));
}

/**
 * Apply filter query to data array (client-side filtering)
 */
export function applyFilter<TData extends Record<string, unknown>>(
  data: TData[],
  query: RuleGroupType,
): TData[] {
  if (!query.rules || query.rules.length === 0) {
    return data;
  }

  const logic = queryToJsonLogic(query);

  if (!logic) {
    return data;
  }

  return filterWithJsonLogic(data, logic);
}

/**
 * Test if a single row matches the filter query
 */
export function rowMatchesFilter<TData extends Record<string, unknown>>(
  row: TData,
  query: RuleGroupType,
): boolean {
  if (!query.rules || query.rules.length === 0) {
    return true;
  }

  const logic = queryToJsonLogic(query);

  if (!logic) {
    return true;
  }

  return applyJsonLogic(logic, row);
}

// ============================================================================
// TanStack Table Integration
// ============================================================================

/**
 * Create a filter function compatible with TanStack Table's filterFn
 */
export function createTableFilterFn<TData extends Record<string, unknown>>(
  query: RuleGroupType,
) {
  const logic = queryToJsonLogic(query);

  return (row: { original: TData }): boolean => {
    if (!logic) return true;
    return applyJsonLogic(logic, row.original);
  };
}
