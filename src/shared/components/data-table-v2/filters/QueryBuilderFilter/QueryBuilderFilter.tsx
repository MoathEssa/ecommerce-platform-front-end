/**
 * QueryBuilderFilter Component
 * Wraps react-querybuilder with DataTableV2 field configuration
 * Uses custom shadcn/ui styled components
 */

import { useCallback, useMemo } from "react";
import {
  QueryBuilder,
  type RuleGroupType,
  type FullOperator,
  type Field,
  defaultOperators,
} from "react-querybuilder";
import { useTranslation } from "react-i18next";
import type { ColumnDef } from "@tanstack/react-table";
import type { DataTableField } from "../../types";
import {
  generateFieldsFromColumns,
  getValueEditorType,
  getValuesForField,
  getInputType,
} from "../fieldConfig";
import { getOperatorsForVariant } from "../operatorConfig";
import { cn } from "@/shared/lib/utils";
import { shadcnControlElements } from "./controlElements";
import "./query-builder.css";

// ============================================================================
// Types
// ============================================================================

export interface QueryBuilderFilterProps<TData = unknown> {
  /** Pre-generated fields (takes precedence over columns) */
  fields?: DataTableField[];
  /** Column definitions to generate fields from (if fields not provided) */
  columns?: ColumnDef<TData, unknown>[];
  /** Current query state */
  query: RuleGroupType;
  /** Callback when query changes */
  onQueryChange: (query: RuleGroupType) => void;
  /** Additional fields not derived from columns */
  additionalFields?: DataTableField[];
  /** Enable drag and drop */
  enableDragAndDrop?: boolean;
  /** Show combinator between rules */
  showCombinatorsBetweenRules?: boolean;
  /** Show NOT toggle */
  showNotToggle?: boolean;
  /** Show clone buttons */
  showCloneButtons?: boolean;
  /** Show lock buttons */
  showLockButtons?: boolean;
  /** Show branch lines connecting rules (adds queryBuilder-branches class) */
  showBranches?: boolean;
  /** Maximum nesting levels */
  maxLevels?: number;
  /** Disabled state */
  disabled?: boolean;
  /** Additional CSS class */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function QueryBuilderFilter<TData = unknown>({
  fields: providedFields,
  columns,
  query,
  onQueryChange,
  additionalFields = [],
  enableDragAndDrop = false,
  showCombinatorsBetweenRules = true,
  showNotToggle = false,
  showCloneButtons = false,
  showLockButtons = false,
  // showBranches = true, // Currently unused, may be used for tree-like visualization
  maxLevels = 1,
  disabled = false,
  className,
}: QueryBuilderFilterProps<TData>) {
  const { t } = useTranslation();

  // Generate fields from columns or use provided fields
  const fields = useMemo<DataTableField[]>(() => {
    if (providedFields) {
      return [...providedFields, ...additionalFields];
    }
    if (columns) {
      const columnFields = generateFieldsFromColumns(columns);
      return [...columnFields, ...additionalFields];
    }
    return additionalFields;
  }, [providedFields, columns, additionalFields]);

  // Get operators based on field
  const getOperators = useCallback(
    (fieldName: string): FullOperator[] => {
      const field = fields.find((f) => f.name === fieldName);
      if (!field) return defaultOperators;
      return getOperatorsForVariant(field.variant);
    },
    [fields],
  );

  // Get value editor type based on field and operator
  const handleGetValueEditorType = useCallback(
    (fieldName: string, operator: string) => {
      return getValueEditorType(fieldName, operator, fields);
    },
    [fields],
  );

  // Get values for select editors
  const handleGetValues = useCallback(
    (fieldName: string, operator: string) => {
      return getValuesForField(fieldName, operator, fields);
    },
    [fields],
  );

  // Get input type for text editors
  const handleGetInputType = useCallback(
    (fieldName: string, operator: string) => {
      return getInputType(fieldName, operator, fields);
    },
    [fields],
  );

  // Translations for i18n
  const translations = useMemo(
    () => ({
      fields: {
        title: t("dataTable.filter.field", "Field"),
        placeholderLabel: t("dataTable.filter.selectField", "Select field..."),
      },
      operators: {
        title: t("dataTable.filter.operator", "Operator"),
        placeholderLabel: t(
          "dataTable.filter.selectOperator",
          "Select operator...",
        ),
      },
      value: {
        title: t("dataTable.filter.value", "Value"),
      },
      removeRule: {
        label: "×",
        title: t("dataTable.filter.removeRule", "Remove rule"),
      },
      removeGroup: {
        label: "×",
        title: t("dataTable.filter.removeGroup", "Remove group"),
      },
      addRule: {
        label: t("dataTable.filter.addRule", "+ Rule"),
        title: t("dataTable.filter.addRule", "Add rule"),
      },
      addGroup: {
        label: t("dataTable.filter.addGroup", "+ Group"),
        title: t("dataTable.filter.addGroup", "Add group"),
      },
      combinators: {
        title: t("dataTable.filter.combinator", "Combinator"),
      },
      notToggle: {
        label: t("dataTable.filter.not", "NOT"),
        title: t("dataTable.filter.invertGroup", "Invert this group"),
      },
      cloneRule: {
        label: "⧉",
        title: t("dataTable.filter.cloneRule", "Clone rule"),
      },
      cloneRuleGroup: {
        label: "⧉",
        title: t("dataTable.filter.cloneGroup", "Clone group"),
      },
      lockRule: {
        label: "🔓",
        title: t("dataTable.filter.lockRule", "Lock rule"),
      },
      lockGroup: {
        label: "🔓",
        title: t("dataTable.filter.lockGroup", "Lock group"),
      },
      lockRuleDisabled: {
        label: "🔒",
        title: t("dataTable.filter.unlockRule", "Unlock rule"),
      },
      lockGroupDisabled: {
        label: "🔒",
        title: t("dataTable.filter.unlockGroup", "Unlock group"),
      },
    }),
    [t],
  );

  // Convert DataTableField[] to Field[] for react-querybuilder
  const queryBuilderFields = useMemo<Field[]>(() => {
    return fields.map((field) => ({
      name: field.name,
      label: field.label,
      placeholder: field.placeholder,
      operators: field.operators,
      defaultOperator: field.defaultOperator,
      valueEditorType: field.valueEditorType,
      values: field.values,
      inputType: field.inputType,
    }));
  }, [fields]);

  // Build controlClassnames - disable branches as they don't align well with custom styling
  const controlClassnames = useMemo(
    () => ({
      queryBuilder: undefined, // Don't use queryBuilder-branches
    }),
    [],
  );

  return (
    <div className={cn("data-table-query-builder", className)}>
      <QueryBuilder
        fields={queryBuilderFields}
        query={query}
        onQueryChange={onQueryChange}
        getOperators={getOperators}
        getValueEditorType={handleGetValueEditorType}
        getValues={handleGetValues}
        getInputType={handleGetInputType}
        controlElements={shadcnControlElements}
        controlClassnames={controlClassnames}
        showCombinatorsBetweenRules={showCombinatorsBetweenRules}
        showNotToggle={showNotToggle}
        showCloneButtons={showCloneButtons}
        showLockButtons={showLockButtons}
        maxLevels={maxLevels}
        enableDragAndDrop={enableDragAndDrop}
        disabled={disabled}
        translations={translations}
        listsAsArrays
        parseNumbers
        resetOnFieldChange
        resetOnOperatorChange={false}
        autoSelectField={false}
        autoSelectOperator
        addRuleToNewGroups
      />
    </div>
  );
}
