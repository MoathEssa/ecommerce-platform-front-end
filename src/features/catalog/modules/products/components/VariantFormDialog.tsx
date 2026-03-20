import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import {
  variantFormSchema,
  type VariantFormValues,
  type VariantFormInput,
} from "../schemas/productSchemas";
import type { AdminProductVariantDto } from "../types";
import VariantOptionEditor from "./VariantOptionEditor";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@shared/ui/dialog";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Switch } from "@shared/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/ui/form";
import { Separator } from "@shared/ui/separator";

// ── Props ─────────────────────────────────────────────────────────────────────

interface VariantFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pass existing variant to edit, null/undefined for create */
  variant?: AdminProductVariantDto | null;
  isSaving: boolean;
  onSubmit: (values: VariantFormValues) => Promise<void>;
}

// ── Helper: convert dict → array for the form ─────────────────────────────────

function dictToOptions(
  options: Record<string, string>,
): { key: string; value: string }[] {
  const entries = Object.entries(options);
  return entries.length > 0
    ? entries.map(([k, v]) => ({ key: k, value: v }))
    : [{ key: "", value: "" }];
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function VariantFormDialog({
  open,
  onOpenChange,
  variant,
  isSaving,
  onSubmit,
}: VariantFormDialogProps) {
  const isEdit = !!variant;

  const form = useForm<VariantFormInput, unknown, VariantFormValues>({
    resolver: zodResolver(variantFormSchema),
    defaultValues: {
      options: variant
        ? dictToOptions(variant.options)
        : [{ key: "", value: "" }],
      basePrice: variant?.basePrice ?? 0,
      currencyCode: variant?.currencyCode ?? "SAR",
      isActive: variant?.isActive ?? true,
      initialStock: 0,
    },
  });

  // Reset when variant changes (switching between edit targets)
  useEffect(() => {
    if (open) {
      form.reset({
        options: variant
          ? dictToOptions(variant.options)
          : [{ key: "", value: "" }],
        basePrice: variant?.basePrice ?? 0,
        currencyCode: variant?.currencyCode ?? "SAR",
        isActive: variant?.isActive ?? true,
        initialStock: 0,
      });
    }
  }, [open, variant, form]);

  async function handleSubmit(values: VariantFormValues) {
    await onSubmit(values);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Variant" : "Add Variant"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            {/* Options */}
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Options <span className="text-destructive">*</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Define what makes this variant unique (e.g. Size + Color).
              </p>
              <VariantOptionEditor control={form.control} />
            </div>

            <Separator />

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="basePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Price <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currencyCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="SAR"
                        maxLength={3}
                        className="uppercase"
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Initial stock — only on create */}
            {!isEdit && (
              <FormField
                control={form.control}
                name="initialStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Stock</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="1" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Units available immediately after creation.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Active toggle */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <FormLabel className="text-sm font-medium">
                      Active
                    </FormLabel>
                    <FormDescription className="text-xs">
                      Inactive variants won't appear on storefront.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? "Save Changes" : "Add Variant"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
