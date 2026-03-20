import type { ColumnDef } from "@tanstack/react-table";
import type { ValueEditorType } from "react-querybuilder";
import type {
  FieldVariant,
  DataTableColumnMeta,
  DataTableField,
  SelectOption,
} from "../types";
import {
  getOperatorsForVariant,
  getDefaultOperatorForVariant,
  relativeDateOptions,
} from "./operatorConfig";

// ============================================================================
// Field Generation from Columns
// ============================================================================

/**
 * Generate react-querybuilder fields from TanStack Table column definitions
 */
export function generateFieldsFromColumns<TData>(
  columns: ColumnDef<TData, unknown>[],
): DataTableField[] {
  const fields: DataTableField[] = [];

  for (const column of columns) {
    // Skip columns that don't have an accessor or are not filterable
    const columnId = getColumnId(column);
    if (!columnId) continue;

    const meta = column.meta as DataTableColumnMeta | undefined;

    // Skip if explicitly marked as not filterable
    if (meta?.filterable === false) continue;

    const variant = meta?.variant ?? "text";
    const field = createFieldFromColumn(columnId, meta, variant);

    if (field) {
      fields.push(field);
    }
  }

  return fields;
}

/**
 * Create a single field from column definition
 */
function createFieldFromColumn(
  columnId: string,
  meta: DataTableColumnMeta | undefined,
  variant: FieldVariant,
): DataTableField {
  const baseField: DataTableField = {
    name: columnId,
    label: meta?.label ?? formatColumnLabel(columnId),
    variant,
    placeholder: meta?.placeholder,
    operators: getOperatorsForVariant(variant),
    defaultOperator: getDefaultOperatorForVariant(variant),
  };

  // Add variant-specific properties
  switch (variant) {
    case "select":
    case "multiSelect":
      baseField.selectOptions = meta?.options;
      baseField.values = meta?.options?.map((opt) => ({
        name: String(opt.value),
        label: opt.label,
      }));
      baseField.valueEditorType =
        variant === "multiSelect" ? "multiselect" : "select";
      break;

    case "number":
    case "range":
      baseField.numberRange = meta?.range;
      baseField.unit = meta?.unit;
      baseField.inputType = "number";
      break;

    case "date":
    case "dateRange":
      baseField.dateFormat = meta?.dateFormat ?? "yyyy-MM-dd";
      baseField.inputType = "date";
      break;

    case "boolean":
      baseField.valueEditorType = "checkbox";
      baseField.values = [
        { name: "true", label: "Yes" },
        { name: "false", label: "No" },
      ];
      break;
  }

  return baseField;
}

// ============================================================================
// Value Editor Type Resolution
// ============================================================================

/**
 * Get the value editor type for a field and operator combination
 * Used as getValueEditorType callback for react-querybuilder
 */
export function getValueEditorType(
  fieldName: string,
  operator: string,
  fields: DataTableField[],
): ValueEditorType {
  const field = fields.find((f) => f.name === fieldName);
  if (!field) return "text";

  // Unary operators (null, notNull) don't need a value editor
  if (operator === "null" || operator === "notNull") {
    return null as unknown as ValueEditorType;
  }

  // Relative date operator uses select
  if (operator === "isRelativeToToday") {
    return "select";
  }

  // Based on field variant
  switch (field.variant) {
    case "select":
      return "select";
    case "multiSelect":
      return "multiselect";
    case "boolean":
      return "checkbox";
    default:
      return "text";
  }
}

/**
 * Get values for select/multiselect editors
 * Used as getValues callback for react-querybuilder
 */
export function getValuesForField(
  fieldName: string,
  operator: string,
  fields: DataTableField[],
): { name: string; label: string }[] {
  const field = fields.find((f) => f.name === fieldName);

  // Relative date operator returns date options
  if (operator === "isRelativeToToday") {
    return relativeDateOptions.map((opt) => ({
      name: opt.name,
      label: opt.label,
    }));
  }

  if (!field) return [];

  // Return field's select options
  if (field.selectOptions) {
    return field.selectOptions.map((opt) => ({
      name: String(opt.value),
      label: opt.label,
    }));
  }

  // Boolean field
  if (field.variant === "boolean") {
    return [
      { name: "true", label: "Yes" },
      { name: "false", label: "No" },
    ];
  }

  return [];
}

/**
 * Get input type for text editors
 * Used as getInputType callback for react-querybuilder
 */
export function getInputType(
  fieldName: string,
  _operator: string,
  fields: DataTableField[],
): string {
  const field = fields.find((f) => f.name === fieldName);
  if (!field) return "text";

  switch (field.variant) {
    case "number":
    case "range":
      return "number";
    case "date":
    case "dateRange":
      return "date";
    default:
      return "text";
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Extract column ID from column definition
 */
function getColumnId<TData>(column: ColumnDef<TData, unknown>): string | null {
  if ("accessorKey" in column && column.accessorKey) {
    return String(column.accessorKey);
  }
  if (column.id) {
    return column.id;
  }
  return null;
}

/**
 * Format column ID into a human-readable label
 * e.g., "firstName" -> "First Name"
 */
function formatColumnLabel(columnId: string): string {
  return (
    columnId
      // Insert space before uppercase letters
      .replace(/([A-Z])/g, " $1")
      // Insert space before numbers
      .replace(/(\d+)/g, " $1")
      // Capitalize first letter
      .replace(/^./, (str) => str.toUpperCase())
      // Trim whitespace
      .trim()
  );
}

/**
 * Get placeholder text for a field
 */
export function getPlaceholder(
  fieldName: string,
  operator: string,
  fields: DataTableField[],
): string {
  const field = fields.find((f) => f.name === fieldName);

  if (field?.placeholder) {
    return field.placeholder;
  }

  // Generate default placeholder based on operator
  switch (operator) {
    case "contains":
    case "doesNotContain":
      return `Search ${field?.label ?? fieldName}...`;
    case "beginsWith":
    case "doesNotBeginWith":
      return `Starts with...`;
    case "endsWith":
    case "doesNotEndWith":
      return `Ends with...`;
    case "between":
    case "notBetween":
      return "Enter range...";
    default:
      return `Enter ${field?.label ?? fieldName}...`;
  }
}

/**
 * Convert SelectOption array to react-querybuilder values format
 */
export function selectOptionsToValues(
  options: SelectOption[],
): { name: string; label: string }[] {
  return options.map((opt) => ({
    name: String(opt.value),
    label: opt.label,
  }));
}
