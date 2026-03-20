import type { UseFormReturn } from "react-hook-form";
import { Controller, useWatch } from "react-hook-form";
import type { CouponFormInput } from "@features/coupons/schemas/couponSchemas";
import { parseIdList } from "@features/coupons/schemas/couponSchemas";
import { formatIdList } from "@features/coupons/schemas/couponSchemas";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/ui/form";
import { Input } from "@shared/ui/input";
import { Checkbox } from "@shared/ui/checkbox";

interface AdminCategory {
  id: number;
  name: string;
}

interface Props {
  form: UseFormReturn<CouponFormInput>;
  adminCategories: AdminCategory[];
}

export default function CouponApplicabilityFields({
  form,
  adminCategories,
}: Props) {
  const applicableCategoryIds = useWatch({
    control: form.control,
    name: "applicableCategoryIds",
  });
  const selectedCatIds = new Set(parseIdList(applicableCategoryIds ?? ""));

  function toggleCategory(id: number) {
    const next = new Set(selectedCatIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    form.setValue("applicableCategoryIds", formatIdList(Array.from(next)), {
      shouldValidate: false,
    });
  }

  return (
    <div>
      <p className="text-sm font-medium mb-0.5">Applicability</p>
      <p className="text-xs text-muted-foreground mb-3">
        Leave all sections empty to apply this coupon to all products globally.
      </p>

      {/* Categories */}
      <div className="mb-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
          Categories
        </p>
        {adminCategories.length === 0 ? (
          <p className="text-xs text-muted-foreground">Loading categories…</p>
        ) : (
          <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto border rounded-md p-2 bg-muted/30">
            {adminCategories.map((cat) => (
              <label
                key={cat.id}
                className="flex items-center gap-2 cursor-pointer text-sm hover:text-foreground py-0.5"
              >
                <Controller
                  control={form.control}
                  name="applicableCategoryIds"
                  render={() => (
                    <Checkbox
                      checked={selectedCatIds.has(cat.id)}
                      onCheckedChange={() => toggleCategory(cat.id)}
                    />
                  )}
                />
                <span className="truncate">{cat.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Product IDs */}
      <FormField
        control={form.control}
        name="applicableProductIds"
        render={({ field }) => (
          <FormItem className="mb-4">
            <FormLabel className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Product IDs
            </FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. 12, 34, 56"
                {...field}
                className="font-mono text-sm"
              />
            </FormControl>
            <FormDescription className="text-xs">
              Comma-separated product IDs (find IDs in Catalog → Products)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Variant IDs */}
      <FormField
        control={form.control}
        name="applicableVariantIds"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Variant IDs
            </FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. 101, 102"
                {...field}
                className="font-mono text-sm"
              />
            </FormControl>
            <FormDescription className="text-xs">
              Comma-separated variant IDs for SKU-level targeting
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
