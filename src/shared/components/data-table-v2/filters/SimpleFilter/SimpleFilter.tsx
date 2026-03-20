/**
 * SimpleFilter Component
 * Quick single-column filter for basic filtering use cases
 */

import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ColumnDef } from "@tanstack/react-table";
import type { RuleGroupType } from "react-querybuilder";
import type {
  DataTableColumnMeta,
  SelectOption,
  FieldVariant,
} from "../../types";
import { getDefaultOperatorForVariant } from "../operatorConfig";
import { cn } from "@/shared/lib/utils";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Button } from "@/shared/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Calendar } from "@/shared/ui/calendar";
import { Checkbox } from "@/shared/ui/checkbox";
import { X, Filter, CalendarIcon } from "lucide-react";
import { format } from "date-fns";

// ============================================================================
// Types
// ============================================================================

export interface SimpleFilterProps<TData> {
  /** Column definitions */
  columns: ColumnDef<TData, unknown>[];
  /** Current query (to convert simple filter to query) */
  query: RuleGroupType;
  /** Callback when filter changes */
  onQueryChange: (query: RuleGroupType) => void;
  /** Disabled when advanced filter is active */
  disabled?: boolean;
  /** Debounce delay in ms */
  debounceMs?: number;
  /** Placeholder text */
  placeholder?: string;
  /** Additional CSS class */
  className?: string;
}

interface SimpleFilterState {
  columnId: string;
  value: string | number | boolean | string[] | Date | null;
}

// ============================================================================
// Component
// ============================================================================

export function SimpleFilter<TData>({
  columns,
  query,
  onQueryChange,
  disabled = false,
  placeholder,
  className,
}: SimpleFilterProps<TData>) {
  const { t } = useTranslation();

  // Get filterable columns
  const filterableColumns = useMemo(() => {
    return columns.filter((col) => {
      const meta = col.meta as DataTableColumnMeta | undefined;
      return (
        meta?.filterable !== false &&
        (("accessorKey" in col && col.accessorKey) || col.id)
      );
    });
  }, [columns]);

  // Extract current simple filter state from query
  const currentFilter = useMemo<SimpleFilterState | null>(() => {
    if (!query.rules || query.rules.length === 0) return null;

    // Simple filter is the first rule in the query
    const firstRule = query.rules[0];
    if ("combinator" in firstRule) return null; // It's a group, not simple

    return {
      columnId: firstRule.field,
      value: firstRule.value as SimpleFilterState["value"],
    };
  }, [query]);

  // Selected column state
  const [selectedColumnId, setSelectedColumnId] = useState<string>(
    currentFilter?.columnId ||
      filterableColumns[0]?.id ||
      (filterableColumns[0] as { accessorKey?: string })?.accessorKey ||
      "",
  );

  // Get selected column meta
  const selectedColumn = useMemo(() => {
    return filterableColumns.find((col) => {
      const colId = col.id || (col as { accessorKey?: string }).accessorKey;
      return colId === selectedColumnId;
    });
  }, [filterableColumns, selectedColumnId]);

  const selectedMeta = selectedColumn?.meta as DataTableColumnMeta | undefined;
  const variant: FieldVariant = selectedMeta?.variant || "text";

  // Handle filter value change
  const handleValueChange = useCallback(
    (value: string | number | boolean | string[] | Date | null) => {
      if (!selectedColumnId) return;

      // Clear filter if value is empty
      if (value === "" || value === null) {
        onQueryChange({ combinator: "and", rules: [] });
        return;
      }

      const operator = getDefaultOperatorForVariant(variant);

      const newQuery: RuleGroupType = {
        combinator: "and",
        rules: [
          {
            field: selectedColumnId,
            operator,
            value: value as string,
          },
        ],
      };

      onQueryChange(newQuery);
    },
    [selectedColumnId, variant, onQueryChange],
  );

  // Handle column change
  const handleColumnChange = useCallback(
    (columnId: string) => {
      setSelectedColumnId(columnId);
      // Clear filter when column changes
      onQueryChange({ combinator: "and", rules: [] });
    },
    [onQueryChange],
  );

  // Handle clear filter
  const handleClear = useCallback(() => {
    onQueryChange({ combinator: "and", rules: [] });
  }, [onQueryChange]);

  // Render value input based on variant
  const renderValueInput = () => {
    switch (variant) {
      case "select":
        return (
          <Select
            value={String(currentFilter?.value || "")}
            onValueChange={handleValueChange}
            disabled={disabled}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue
                placeholder={
                  placeholder || t("dataTable.filter.selectValue", "Select...")
                }
              />
            </SelectTrigger>
            <SelectContent>
              {selectedMeta?.options?.map((option: SelectOption) => (
                <SelectItem
                  key={String(option.value)}
                  value={String(option.value)}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "multiSelect":
        return (
          <Select
            value={String(currentFilter?.value || "")}
            onValueChange={handleValueChange}
            disabled={disabled}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue
                placeholder={
                  placeholder || t("dataTable.filter.selectValues", "Select...")
                }
              />
            </SelectTrigger>
            <SelectContent>
              {selectedMeta?.options?.map((option: SelectOption) => (
                <SelectItem
                  key={String(option.value)}
                  value={String(option.value)}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "boolean":
        return (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={
                currentFilter?.value === true || currentFilter?.value === "true"
              }
              onCheckedChange={(checked) =>
                handleValueChange(checked as boolean)
              }
              disabled={disabled}
            />
            <span className="text-sm">
              {selectedMeta?.label || selectedColumnId}
            </span>
          </div>
        );

      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[180px] justify-start text-left font-normal",
                  !currentFilter?.value && "text-muted-foreground",
                )}
                disabled={disabled}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {currentFilter?.value
                  ? format(new Date(currentFilter.value as string), "PPP")
                  : placeholder ||
                    t("dataTable.filter.pickDate", "Pick a date")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={
                  currentFilter?.value
                    ? new Date(currentFilter.value as string)
                    : undefined
                }
                onSelect={(date) =>
                  handleValueChange(date ? date.toISOString() : null)
                }
              />
            </PopoverContent>
          </Popover>
        );

      case "number":
      case "range":
        return (
          <Input
            type="number"
            value={String(currentFilter?.value || "")}
            onChange={(e) =>
              handleValueChange(e.target.value ? Number(e.target.value) : "")
            }
            placeholder={
              placeholder ||
              selectedMeta?.placeholder ||
              t("dataTable.filter.enterNumber", "Enter number...")
            }
            className="w-[180px]"
            disabled={disabled}
            min={selectedMeta?.range?.[0]}
            max={selectedMeta?.range?.[1]}
          />
        );

      case "text":
      default:
        return (
          <Input
            type="text"
            value={String(currentFilter?.value || "")}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder={
              placeholder ||
              selectedMeta?.placeholder ||
              t("dataTable.filter.search", "Search...")
            }
            className="w-[180px]"
            disabled={disabled}
          />
        );
    }
  };

  if (filterableColumns.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Filter className="h-4 w-4 text-muted-foreground" />

      {/* Column selector */}
      <Select
        value={selectedColumnId}
        onValueChange={handleColumnChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue
            placeholder={t("dataTable.filter.selectColumn", "Select column")}
          />
        </SelectTrigger>
        <SelectContent>
          {filterableColumns.map((col) => {
            const colId =
              col.id || (col as { accessorKey?: string }).accessorKey || "";
            const meta = col.meta as DataTableColumnMeta | undefined;
            return (
              <SelectItem key={colId} value={colId}>
                {meta?.label || colId}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {/* Value input */}
      {renderValueInput()}

      {/* Clear button */}
      {currentFilter?.value && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClear}
          disabled={disabled}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
