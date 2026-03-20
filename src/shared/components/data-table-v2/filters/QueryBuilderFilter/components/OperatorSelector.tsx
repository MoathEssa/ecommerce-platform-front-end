/**
 * Operator Selector Component
 * Operator dropdown for query builder rules
 */

import type { OperatorSelectorProps } from "react-querybuilder";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { cn } from "@/shared/lib/utils";
import { flattenOptions, getOptionValue, getOptionLabel } from "./utils";

export function OperatorSelector({
  options,
  value,
  handleOnChange,
  disabled,
  className,
  title,
}: OperatorSelectorProps) {
  const flatOptions = flattenOptions(options);

  return (
    <Select value={value} onValueChange={handleOnChange} disabled={disabled}>
      <SelectTrigger className={cn("w-36 h-8", className)} title={title}>
        <SelectValue placeholder="Select operator..." />
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
