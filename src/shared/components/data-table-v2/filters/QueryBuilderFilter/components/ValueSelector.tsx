/**
 * Value Selector Component
 * Select/multiselect value inputs for query builder
 */

import type { ValueSelectorProps } from "react-querybuilder";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Checkbox } from "@/shared/ui/checkbox";
import { cn } from "@/shared/lib/utils";
import { flattenOptions, getOptionValue, getOptionLabel } from "./utils";

export function ValueSelector({
  options,
  value,
  handleOnChange,
  disabled,
  multiple,
  className,
  title,
}: ValueSelectorProps) {
  const flatOptions = flattenOptions(options);

  if (multiple) {
    // Multi-select - use checkboxes
    const selectedValues: string[] = Array.isArray(value)
      ? value.map(String)
      : [];

    return (
      <div
        className={cn(
          "flex flex-wrap gap-2 p-2 border rounded-md min-w-50",
          className,
        )}
      >
        {flatOptions.map((option) => {
          const optionValue = getOptionValue(option);
          const optionLabel = getOptionLabel(option);
          const isChecked = selectedValues.includes(optionValue);

          return (
            <label
              key={optionValue}
              className="flex items-center gap-1 text-sm cursor-pointer"
            >
              <Checkbox
                checked={isChecked}
                disabled={disabled}
                onCheckedChange={(checked) => {
                  const newValues = checked
                    ? [...selectedValues, optionValue]
                    : selectedValues.filter((v) => v !== optionValue);
                  handleOnChange(newValues.join(","));
                }}
              />
              {optionLabel}
            </label>
          );
        })}
      </div>
    );
  }

  return (
    <Select
      value={value as string}
      onValueChange={handleOnChange}
      disabled={disabled}
    >
      <SelectTrigger className={cn("w-44 h-8", className)} title={title}>
        <SelectValue placeholder="Select value..." />
      </SelectTrigger>
      <SelectContent>
        {flatOptions.map((option) => {
          const optionValue = getOptionValue(option);
          const optionLabel = getOptionLabel(option);
          return (
            <SelectItem key={optionValue} value={optionValue}>
              {optionLabel}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
