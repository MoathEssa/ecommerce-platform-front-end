/**
 * Shadcn UI Components for React Query Builder
 * Custom styled components using shadcn/ui primitives
 */

import type {
  ActionWithRulesAndAddersProps,
  CombinatorSelectorProps,
  FieldSelectorProps,
  OperatorSelectorProps,
  ValueEditorProps,
  ValueSelectorProps,
} from "react-querybuilder";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Checkbox } from "@/shared/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Trash2, Plus, Copy, GripVertical } from "lucide-react";
import { cn } from "@/shared/lib/utils";

// Helper to check if option is an OptionGroup
function isOptionGroup(
  option: unknown,
): option is { label: string; options: unknown[] } {
  return (
    typeof option === "object" &&
    option !== null &&
    "options" in option &&
    Array.isArray((option as { options: unknown[] }).options)
  );
}

// Helper to get option value/name
function getOptionValue(option: unknown): string {
  if (typeof option === "string") return option;
  if (
    typeof option === "object" &&
    option !== null &&
    "name" in option &&
    typeof (option as { name: unknown }).name === "string"
  ) {
    return (option as { name: string }).name;
  }
  if (
    typeof option === "object" &&
    option !== null &&
    "value" in option &&
    typeof (option as { value: unknown }).value === "string"
  ) {
    return (option as { value: string }).value;
  }
  return String(option);
}

// Helper to get option label
function getOptionLabel(option: unknown): string {
  if (typeof option === "string") return option;
  if (
    typeof option === "object" &&
    option !== null &&
    "label" in option &&
    typeof (option as { label: unknown }).label === "string"
  ) {
    return (option as { label: string }).label;
  }
  return getOptionValue(option);
}

// ============================================================================
// Combinator Selector (AND/OR)
// ============================================================================

export function ShadcnCombinatorSelector({
  options,
  value,
  handleOnChange,
  disabled,
  className,
}: CombinatorSelectorProps) {
  // Flatten options if needed
  const flatOptions = options.flatMap((opt) =>
    isOptionGroup(opt) ? opt.options : [opt],
  );

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

// ============================================================================
// Field Selector
// ============================================================================

export function ShadcnFieldSelector({
  options,
  value,
  handleOnChange,
  disabled,
  className,
  title,
}: FieldSelectorProps) {
  // Flatten options if needed
  const flatOptions = options.flatMap((opt) =>
    isOptionGroup(opt) ? opt.options : [opt],
  );

  return (
    <Select value={value} onValueChange={handleOnChange} disabled={disabled}>
      <SelectTrigger className={cn("w-44 h-8", className)} title={title}>
        <SelectValue placeholder="Select field..." />
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

// ============================================================================
// Operator Selector
// ============================================================================

export function ShadcnOperatorSelector({
  options,
  value,
  handleOnChange,
  disabled,
  className,
  title,
}: OperatorSelectorProps) {
  // Flatten options if needed
  const flatOptions = options.flatMap((opt) =>
    isOptionGroup(opt) ? opt.options : [opt],
  );

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

// ============================================================================
// Value Selector (for select/multiselect fields)
// ============================================================================

export function ShadcnValueSelector({
  options,
  value,
  handleOnChange,
  disabled,
  multiple,
  className,
  title,
}: ValueSelectorProps) {
  // Flatten options if needed
  // Flatten options if needed
  const flatOptions = options.flatMap((opt) =>
    isOptionGroup(opt) ? opt.options : [opt],
  );

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

// ============================================================================
// Value Editor
// ============================================================================

export function ShadcnValueEditor({
  operator,
  value,
  handleOnChange,
  type,
  inputType,
  values,
  disabled,
  className,
  title,
  selectorComponent: SelectorComponent = ShadcnValueSelector,
}: ValueEditorProps) {
  // Null operators don't need value
  if (operator === "null" || operator === "notNull") {
    return null;
  }

  // Between operator - two inputs
  if (operator === "between" || operator === "notBetween") {
    const [val1, val2] = Array.isArray(value) ? value : [value, ""];
    return (
      <div className={cn("flex items-center gap-1", className)}>
        <Input
          type={inputType || "text"}
          value={val1 ?? ""}
          onChange={(e) => handleOnChange([e.target.value, val2])}
          disabled={disabled}
          className="w-24 h-8"
          placeholder="from"
        />
        <span className="text-muted-foreground text-sm">and</span>
        <Input
          type={inputType || "text"}
          value={val2 ?? ""}
          onChange={(e) => handleOnChange([val1, e.target.value])}
          disabled={disabled}
          className="w-24 h-8"
          placeholder="to"
        />
      </div>
    );
  }

  // Select type with values
  if (type === "select" && values && values.length > 0) {
    return (
      <SelectorComponent
        options={values}
        value={value}
        handleOnChange={handleOnChange}
        disabled={disabled}
        className={className}
        title={title}
        multiple={false}
        listsAsArrays={false}
        path={[]}
        level={0}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        schema={{} as any}
        context={{}}
      />
    );
  }

  // Multiselect type
  if (type === "multiselect" && values && values.length > 0) {
    return (
      <SelectorComponent
        options={values}
        value={value}
        handleOnChange={handleOnChange}
        disabled={disabled}
        className={className}
        title={title}
        multiple={true}
        listsAsArrays={true}
        path={[]}
        level={0}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        schema={{} as any}
        context={{}}
      />
    );
  }

  // Checkbox type
  if (type === "checkbox") {
    return (
      <Checkbox
        checked={!!value}
        onCheckedChange={(checked) => handleOnChange(checked)}
        disabled={disabled}
        className={className}
      />
    );
  }

  // Default text/number input
  return (
    <Input
      type={inputType || "text"}
      value={value ?? ""}
      onChange={(e) => handleOnChange(e.target.value)}
      disabled={disabled}
      className={cn("w-44 h-8", className)}
      placeholder="Enter value..."
      title={title}
    />
  );
}

// ============================================================================
// Action Buttons
// ============================================================================

export function ShadcnAddRuleAction({
  handleOnClick,
  disabled,
  className,
  label,
  title,
}: ActionWithRulesAndAddersProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleOnClick}
      disabled={disabled}
      className={cn("h-8 gap-1", className)}
      title={title}
    >
      <Plus className="h-3.5 w-3.5" />
      {label}
    </Button>
  );
}

export function ShadcnAddGroupAction({
  handleOnClick,
  disabled,
  className,
  label,
  title,
}: ActionWithRulesAndAddersProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleOnClick}
      disabled={disabled}
      className={cn("h-8 gap-1", className)}
      title={title}
    >
      <Plus className="h-3.5 w-3.5" />
      {label}
    </Button>
  );
}

export function ShadcnRemoveRuleAction({
  handleOnClick,
  disabled,
  className,
  title,
}: ActionWithRulesAndAddersProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleOnClick}
      disabled={disabled}
      className={cn(
        "h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10",
        className,
      )}
      title={title}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}

export function ShadcnRemoveGroupAction({
  handleOnClick,
  disabled,
  className,
  title,
}: ActionWithRulesAndAddersProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleOnClick}
      disabled={disabled}
      className={cn(
        "h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10",
        className,
      )}
      title={title}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}

export function ShadcnCloneRuleAction({
  handleOnClick,
  disabled,
  className,
  title,
}: ActionWithRulesAndAddersProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleOnClick}
      disabled={disabled}
      className={cn("h-8 w-8 p-0", className)}
      title={title}
    >
      <Copy className="h-4 w-4" />
    </Button>
  );
}

export function ShadcnCloneGroupAction({
  handleOnClick,
  disabled,
  className,
  title,
}: ActionWithRulesAndAddersProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleOnClick}
      disabled={disabled}
      className={cn("h-8 w-8 p-0", className)}
      title={title}
    >
      <Copy className="h-4 w-4" />
    </Button>
  );
}

// ============================================================================
// Drag Handle
// ============================================================================

export function ShadcnDragHandle({ className }: { className?: string }) {
  return (
    <div className={cn("cursor-grab text-muted-foreground", className)}>
      <GripVertical className="h-4 w-4" />
    </div>
  );
}
