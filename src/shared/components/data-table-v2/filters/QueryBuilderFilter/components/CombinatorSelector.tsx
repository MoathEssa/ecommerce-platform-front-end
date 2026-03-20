/**
 * Combinator Selector Component
 * AND/OR selector for query builder groups
 */

import type { CombinatorSelectorProps } from "react-querybuilder";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { cn } from "@/shared/lib/utils";
import { flattenOptions, getOptionValue, getOptionLabel } from "./utils";

export function CombinatorSelector({
  options,
  value,
  handleOnChange,
  disabled,
  className,
}: CombinatorSelectorProps) {
  const flatOptions = flattenOptions(options);

  return (
    <Select value={value} onValueChange={handleOnChange} disabled={disabled}>
      <SelectTrigger className={cn("w-20 h-8", className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {flatOptions.map((option) => {
          const optValue = getOptionValue(option);
          const optLabel = getOptionLabel(option);
          return (
            <SelectItem key={optValue} value={optValue}>
              {optLabel}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
