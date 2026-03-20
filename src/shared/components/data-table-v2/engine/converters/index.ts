/**
 * Query Export Utilities
 * Thin wrappers around react-querybuilder's formatQuery
 * Only adds custom handling for extended operators (isRelativeToToday)
 */

import {
  formatQuery,
  defaultRuleProcessorJsonLogic,
  defaultRuleProcessorSQL,
  defaultRuleProcessorMongoDB,
  jsonLogicAdditionalOperators,
  type RuleProcessor,
  type RuleGroupType,
} from "react-querybuilder";
import jsonLogic from "json-logic-js";
import { format as formatDate } from "date-fns";
import {
  getRelativeDateRange,
  type RelativeDateOption,
} from "../../filters/operatorConfig";

// ============================================================================
// Register JSON Logic Additional Operators (beginsWith, endsWith)
// ============================================================================

let jsonLogicOpsRegistered = false;

export function registerJsonLogicOperators(): void {
  if (jsonLogicOpsRegistered) return;

  for (const [op, func] of Object.entries(jsonLogicAdditionalOperators)) {
    jsonLogic.add_operation(op, func as (...args: unknown[]) => unknown);
  }

  // Register our custom isRelativeToToday operator
  jsonLogic.add_operation(
    "isRelativeToToday",
    (dateValue: string, period: string) => {
      if (!dateValue || !period) return false;
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return false;
      const range = getRelativeDateRange(period as RelativeDateOption);
      return date >= range.start && date <= range.end;
    },
  );

  jsonLogicOpsRegistered = true;
}

// Auto-register on import
registerJsonLogicOperators();

// ============================================================================
// Custom Rule Processors for Extended Operators
// ============================================================================

/**
 * Custom rule processor for JSON Logic format
 * Handles isRelativeToToday, and fixes "in"/"notIn" for array fields
 */
export const jsonLogicRuleProcessor: RuleProcessor = (rule, options) => {
  if (rule.operator === "isRelativeToToday") {
    return { isRelativeToToday: [{ var: rule.field }, rule.value] };
  }

  // For "in" operator - check if value is in the field (array)
  // json-logic "in" expects: {"in": [needle, haystack]}
  // So we need: {"in": [value, {"var": "field"}]}
  if (rule.operator === "in") {
    const value = rule.value;
    // If single value, check if it's in the array field
    if (typeof value === "string" || typeof value === "number") {
      return { in: [value, { var: rule.field }] };
    }
    // If multiple values (array), use "some" with "in" check
    if (Array.isArray(value) && value.length > 0) {
      // Check if ANY of the values are in the field array
      // Use "some" operator: {"some": [array, {"in": [{"var": ""}, values]}]}
      return {
        some: [{ var: rule.field }, { in: [{ var: "" }, value] }],
      };
    }
  }

  // For "notIn" operator - check if value is NOT in the field (array)
  if (rule.operator === "notIn") {
    const value = rule.value;
    // If single value, check if it's NOT in the array field
    if (typeof value === "string" || typeof value === "number") {
      return { "!": { in: [value, { var: rule.field }] } };
    }
    // If multiple values, check that NONE of them are in the field array
    if (Array.isArray(value) && value.length > 0) {
      return {
        none: [{ var: rule.field }, { in: [{ var: "" }, value] }],
      };
    }
  }

  return defaultRuleProcessorJsonLogic(rule, options);
};

/**
 * Custom rule processor for SQL format
 * Converts isRelativeToToday to BETWEEN clause
 */
export const sqlRuleProcessor: RuleProcessor = (rule, options) => {
  if (rule.operator === "isRelativeToToday") {
    const range = getRelativeDateRange(rule.value as RelativeDateOption);
    const startStr = formatDate(range.start, "yyyy-MM-dd HH:mm:ss");
    const endStr = formatDate(range.end, "yyyy-MM-dd HH:mm:ss");
    return `${rule.field} BETWEEN '${startStr}' AND '${endStr}'`;
  }
  return defaultRuleProcessorSQL(rule, options);
};

/**
 * Custom rule processor for MongoDB format
 * Converts isRelativeToToday to $gte/$lte query
 */
export const mongoDbRuleProcessor: RuleProcessor = (rule, options) => {
  if (rule.operator === "isRelativeToToday") {
    const range = getRelativeDateRange(rule.value as RelativeDateOption);
    return {
      [rule.field]: {
        $gte: range.start.toISOString(),
        $lte: range.end.toISOString(),
      },
    };
  }
  return defaultRuleProcessorMongoDB(rule, options);
};

// ============================================================================
// Export Functions (Simple Wrappers)
// ============================================================================

export type ExportFormat =
  | "json"
  | "json_without_ids"
  | "sql"
  | "parameterized"
  | "parameterized_named"
  | "mongodb"
  | "mongodb_query"
  | "jsonlogic"
  | "cel"
  | "spel"
  | "elasticsearch"
  | "jsonata"
  | "ldap"
  | "natural_language";

export interface ExportOptions {
  format: ExportFormat;
  parseNumbers?: boolean;
  // SQL specific
  quoteFieldNamesWith?: string | [string, string];
  paramPrefix?: string;
  // Additional options passed to formatQuery
  [key: string]: unknown;
}

/**
 * Export query to any supported format
 * Uses react-querybuilder's formatQuery with custom rule processors for extended operators
 */
export function exportQuery(
  query: RuleGroupType,
  options: ExportOptions,
): unknown {
  const { format, ...restOptions } = options;

  // Select appropriate rule processor based on format
  let ruleProcessor: RuleProcessor | undefined;

  switch (format) {
    case "jsonlogic":
      ruleProcessor = jsonLogicRuleProcessor;
      break;
    case "sql":
    case "parameterized":
    case "parameterized_named":
      ruleProcessor = sqlRuleProcessor;
      break;
    case "mongodb":
    case "mongodb_query":
      ruleProcessor = mongoDbRuleProcessor;
      break;
  }

  return formatQuery(query, {
    format,
    ruleProcessor,
    parseNumbers: true,
    ...restOptions,
  });
}

/**
 * Export to JSON Logic format
 */
export function toJsonLogic(query: RuleGroupType) {
  return exportQuery(query, { format: "jsonlogic" });
}

/**
 * Export to SQL WHERE clause
 */
export function toSql(query: RuleGroupType, options?: Partial<ExportOptions>) {
  return exportQuery(query, { format: "sql", ...options }) as string;
}

/**
 * Export to parameterized SQL
 */
export function toParameterizedSql(
  query: RuleGroupType,
  options?: Partial<ExportOptions>,
) {
  return exportQuery(query, { format: "parameterized", ...options }) as {
    sql: string;
    params: unknown[];
  };
}

/**
 * Export to MongoDB query object
 */
export function toMongoDB(query: RuleGroupType) {
  return exportQuery(query, { format: "mongodb_query" });
}

/**
 * Export to CEL (Common Expression Language)
 */
export function toCEL(query: RuleGroupType) {
  return exportQuery(query, { format: "cel" }) as string;
}

/**
 * Export to SpEL (Spring Expression Language)
 */
export function toSpEL(query: RuleGroupType) {
  return exportQuery(query, { format: "spel" }) as string;
}

/**
 * Export to ElasticSearch query
 */
export function toElasticSearch(query: RuleGroupType) {
  return exportQuery(query, { format: "elasticsearch" });
}

/**
 * Export to natural language (human readable)
 */
export function toNaturalLanguage(query: RuleGroupType) {
  return exportQuery(query, { format: "natural_language" }) as string;
}
