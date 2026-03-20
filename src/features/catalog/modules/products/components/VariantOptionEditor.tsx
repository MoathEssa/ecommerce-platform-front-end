import { useFieldArray } from "react-hook-form";
import type { Control } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";

import type { VariantFormInput } from "../schemas/productSchemas";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { FormControl, FormField, FormItem, FormMessage } from "@shared/ui/form";

// ── Props ─────────────────────────────────────────────────────────────────────

interface VariantOptionEditorProps {
  control: Control<VariantFormInput>;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function VariantOptionEditor({
  control,
}: VariantOptionEditorProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[1fr_1fr_auto] gap-2 text-xs font-medium text-muted-foreground px-1">
        <span>Option (e.g. Size)</span>
        <span>Value (e.g. M)</span>
        <span />
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] gap-2">
          <FormField
            control={control}
            name={`options.${index}.key`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Size" {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`options.${index}.value`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="M" {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => remove(index)}
            disabled={fields.length === 1}
            className="mt-0.5 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ key: "", value: "" })}
        className="w-full"
      >
        <Plus className="mr-2 h-3.5 w-3.5" />
        Add Option
      </Button>
    </div>
  );
}
