import type { UseFormReturn } from "react-hook-form";
import type { CouponFormInput } from "@features/coupons/schemas/couponSchemas";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/ui/form";
import { Input } from "@shared/ui/input";

interface Props {
  form: UseFormReturn<CouponFormInput>;
}

export default function CouponLimitsFields({ form }: Props) {
  return (
    <>
      {/* Min Order + Max Discount */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="minOrderAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Min Order Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="0.00 (optional)"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? null : Number(e.target.value),
                    )
                  }
                />
              </FormControl>
              <FormDescription className="text-xs">
                Leave blank for no minimum
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maxDiscountAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Discount Cap ($)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="50.00 (optional)"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? null : Number(e.target.value),
                    )
                  }
                />
              </FormControl>
              <FormDescription className="text-xs">
                Max amount saved, useful for % coupons
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Usage Limits */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="usageLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Global Usage Limit</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  step={1}
                  placeholder="Unlimited (optional)"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? null : Number(e.target.value),
                    )
                  }
                />
              </FormControl>
              <FormDescription className="text-xs">
                Total times this coupon can be used
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="perUserLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Per-User Limit *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  step={1}
                  placeholder="1"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-xs">
                Max uses per customer
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
