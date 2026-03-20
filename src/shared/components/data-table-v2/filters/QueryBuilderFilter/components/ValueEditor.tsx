/**
 * Value Editor Component
 * Input component for rule values in query builder
 */

import type { ValueEditorProps } from "react-querybuilder";
import { Input } from "@/shared/ui/input";
import { Checkbox } from "@/shared/ui/checkbox";
import { cn } from "@/shared/lib/utils";
import { ValueSelector } from "./ValueSelector";

export function ValueEditor({
  operator,
  value,
  handleOnChange,
  type,
  inputType,
  values,
  disabled,
  className,
  title,
  selectorComponent: SelectorComponent = ValueSelector,
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
