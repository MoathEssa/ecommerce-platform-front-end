/**
 * Operator Configuration for DataTableV2
 * Uses react-querybuilder's default operators as base,
 * with minimal extensions for specialized use cases
 */

import { defaultOperators, type FullOperator } from "react-querybuilder";
import type { FieldVariant } from "../types";

// ============================================================================
// Default Operators from react-querybuilder
// ============================================================================

/**
 * Default operators provided by react-querybuilder:
 * - '=' (equals)
 * - '!=' (not equals)
 * - '<' (less than)
 * - '>' (greater than)
 * - '<=' (less than or equal)
 * - '>=' (greater than or equal)
 * - 'contains'
 * - 'beginsWith'
 * - 'endsWith'
 * - 'doesNotContain'
 * - 'doesNotBeginWith'
 * - 'doesNotEndWith'
 * - 'null' (is null)
 * - 'notNull' (is not null)
 * - 'in'
 * - 'notIn'
 * - 'between'
 * - 'notBetween'
 */

// ============================================================================
// Extended Operators (additions only)
// ============================================================================

/**
 * Custom operators that extend the default set
 * Only add operators that don't exist in react-querybuilder
 */
export const extendedOperators: FullOperator[] = [
  {
    name: "isRelativeToToday",
    value: "isRelativeToToday",
    label: "is relative to today",
  },
];

/**
 * Complete operator list (defaults + extensions)
 */
export const allOperators: FullOperator[] = [
  ...defaultOperators,
  ...extendedOperators,
];

// ============================================================================
// Operator Groups by Field Variant
// ============================================================================

/**
 * Operator names for text fields
 */
const textOperatorNames = [
  "=",
  "!=",
  "contains",
  "doesNotContain",
  "beginsWith",
  "doesNotBeginWith",
  "endsWith",
  "doesNotEndWith",
  "null",
  "notNull",
] as const;

/**
 * Operator names for number fields
 */
const numberOperatorNames = [
  "=",
  "!=",
  "<",
  ">",
  "<=",
  ">=",
  "between",
  "notBetween",
  "null",
  "notNull",
] as const;

/**
 * Operator names for date fields (including extension)
 */
const dateOperatorNames = [
  "=",
  "!=",
  "<",
  ">",
  "<=",
  ">=",
  "between",
  "notBetween",
  "null",
  "notNull",
  "isRelativeToToday", // Extended operator
] as const;

/**
 * Operator names for dateRange fields
 */
const dateRangeOperatorNames = ["between", "notBetween"] as const;

/**
 * Operator names for select fields
 */
const selectOperatorNames = ["=", "!=", "null", "notNull"] as const;

/**
 * Operator names for multiSelect fields
 */
const multiSelectOperatorNames = ["in", "notIn", "null", "notNull"] as const;

/**
 * Operator names for boolean fields
 */
const booleanOperatorNames = ["=", "!="] as const;

/**
 * Operator names for range fields
 */
const rangeOperatorNames = [
  "=",
  "!=",
  "<",
  ">",
  "<=",
  ">=",
  "between",
  "notBetween",
] as const;

// ============================================================================
// Operator Retrieval Functions
// ============================================================================

/**
 * Get operators for a specific field variant
 * Used as getOperators callback for react-querybuilder
 */
export function getOperatorsForVariant(variant: FieldVariant): FullOperator[] {
  const operatorNames = getOperatorNamesForVariant(variant);

  return allOperators.filter((op) =>
    operatorNames.includes(op.name as (typeof operatorNames)[number]),
  );
}

/**
 * Get operator names for a specific field variant
 */
export function getOperatorNamesForVariant(
  variant: FieldVariant,
): readonly string[] {
  switch (variant) {
    case "text":
      return textOperatorNames;
    case "number":
      return numberOperatorNames;
    case "date":
      return dateOperatorNames;
    case "dateRange":
      return dateRangeOperatorNames;
    case "select":
      return selectOperatorNames;
    case "multiSelect":
      return multiSelectOperatorNames;
    case "boolean":
      return booleanOperatorNames;
    case "range":
      return rangeOperatorNames;
    default:
      return textOperatorNames;
  }
}

/**
 * Check if an operator is a custom extension
 */
export function isExtendedOperator(operatorName: string): boolean {
  return extendedOperators.some((op) => op.name === operatorName);
}

/**
 * Get the default operator for a field variant
 */
export function getDefaultOperatorForVariant(variant: FieldVariant): string {
  switch (variant) {
    case "text":
      return "contains";
    case "number":
    case "range":
      return "=";
    case "date":
      return "=";
    case "dateRange":
      return "between";
    case "select":
      return "=";
    case "multiSelect":
      return "in";
    case "boolean":
      return "=";
    default:
      return "=";
  }
}

// ============================================================================
// Relative Date Options (for isRelativeToToday operator)
// ============================================================================

/**
 * Options for the isRelativeToToday operator
 */
export const relativeDateOptions = [
  { name: "today", label: "Today" },
  { name: "yesterday", label: "Yesterday" },
  { name: "tomorrow", label: "Tomorrow" },
  { name: "last7days", label: "Last 7 days" },
  { name: "last30days", label: "Last 30 days" },
  { name: "last90days", label: "Last 90 days" },
  { name: "thisWeek", label: "This week" },
  { name: "lastWeek", label: "Last week" },
  { name: "thisMonth", label: "This month" },
  { name: "lastMonth", label: "Last month" },
  { name: "thisQuarter", label: "This quarter" },
  { name: "lastQuarter", label: "Last quarter" },
  { name: "thisYear", label: "This year" },
  { name: "lastYear", label: "Last year" },
] as const;

export type RelativeDateOption = (typeof relativeDateOptions)[number]["name"];

/**
 * Get date range for relative date option
 */
export function getRelativeDateRange(option: RelativeDateOption): {
  start: Date;
  end: Date;
} {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(today);
  endOfToday.setHours(23, 59, 59, 999);

  switch (option) {
    case "today":
      return { start: today, end: endOfToday };

    case "yesterday": {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const endOfYesterday = new Date(yesterday);
      endOfYesterday.setHours(23, 59, 59, 999);
      return { start: yesterday, end: endOfYesterday };
    }

    case "tomorrow": {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const endOfTomorrow = new Date(tomorrow);
      endOfTomorrow.setHours(23, 59, 59, 999);
      return { start: tomorrow, end: endOfTomorrow };
    }

    case "last7days": {
      const start = new Date(today);
      start.setDate(start.getDate() - 6);
      return { start, end: endOfToday };
    }

    case "last30days": {
      const start = new Date(today);
      start.setDate(start.getDate() - 29);
      return { start, end: endOfToday };
    }

    case "last90days": {
      const start = new Date(today);
      start.setDate(start.getDate() - 89);
      return { start, end: endOfToday };
    }

    case "thisWeek": {
      const start = new Date(today);
      start.setDate(start.getDate() - start.getDay());
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }

    case "lastWeek": {
      const start = new Date(today);
      start.setDate(start.getDate() - start.getDay() - 7);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }

    case "thisMonth": {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }

    case "lastMonth": {
      const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const end = new Date(today.getFullYear(), today.getMonth(), 0);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }

    case "thisQuarter": {
      const quarter = Math.floor(today.getMonth() / 3);
      const start = new Date(today.getFullYear(), quarter * 3, 1);
      const end = new Date(today.getFullYear(), quarter * 3 + 3, 0);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }

    case "lastQuarter": {
      const quarter = Math.floor(today.getMonth() / 3) - 1;
      const year = quarter < 0 ? today.getFullYear() - 1 : today.getFullYear();
      const q = quarter < 0 ? 3 : quarter;
      const start = new Date(year, q * 3, 1);
      const end = new Date(year, q * 3 + 3, 0);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }

    case "thisYear": {
      const start = new Date(today.getFullYear(), 0, 1);
      const end = new Date(today.getFullYear(), 11, 31);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }

    case "lastYear": {
      const start = new Date(today.getFullYear() - 1, 0, 1);
      const end = new Date(today.getFullYear() - 1, 11, 31);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }

    default:
      return { start: today, end: endOfToday };
  }
}

// ============================================================================
// Operator Metadata
// ============================================================================

/**
 * Operators that don't require a value (unary operators)
 */
export const unaryOperators = ["null", "notNull"] as const;

/**
 * Operators that require two values (between operators)
 */
export const betweenOperators = ["between", "notBetween"] as const;

/**
 * Operators that require multiple values (list operators)
 */
export const listOperators = ["in", "notIn"] as const;

/**
 * Check if an operator is unary (no value needed)
 */
export function isUnaryOperator(operatorName: string): boolean {
  return unaryOperators.includes(
    operatorName as (typeof unaryOperators)[number],
  );
}

/**
 * Check if an operator is a between operator (two values needed)
 */
export function isBetweenOperator(operatorName: string): boolean {
  return betweenOperators.includes(
    operatorName as (typeof betweenOperators)[number],
  );
}

/**
 * Check if an operator is a list operator (multiple values)
 */
export function isListOperator(operatorName: string): boolean {
  return listOperators.includes(operatorName as (typeof listOperators)[number]);
}
