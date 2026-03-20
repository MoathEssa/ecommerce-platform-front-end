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

export default function CouponDateFields({ form }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="startsAt"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Start Date</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormDescription className="text-xs">
              Leave blank to start immediately
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="expiresAt"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Expiry Date</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormDescription className="text-xs">
              Leave blank for no expiry
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
