import type { UseFormReturn } from "react-hook-form";
import { useWatch } from "react-hook-form";
import type { CouponFormInput } from "@features/coupons/schemas/couponSchemas";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/select";
import { Input } from "@shared/ui/input";
import { Switch } from "@shared/ui/switch";

interface Props {
  form: UseFormReturn<CouponFormInput>;
}

export default function CouponBasicFields({ form }: Props) {
  const discountType = useWatch({
    control: form.control,
    name: "discountType",
  });

  return (
    <>
      {/* Code + Active */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code *</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. SUMMER20"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  className="font-mono uppercase"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-col justify-end pb-1">
              <FormLabel>Active</FormLabel>
              <div className="flex items-center gap-2 pt-1">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <span className="text-sm text-muted-foreground">
                  {field.value ? "Enabled" : "Disabled"}
                </span>
              </div>
            </FormItem>
          )}
        />
      </div>

      {/* Discount Type + Value */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="discountType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Type *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Percentage">Percentage (%)</SelectItem>
                  <SelectItem value="FixedAmount">Fixed Amount ($)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="discountValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Discount Value * {discountType === "Percentage" ? "(%)" : "($)"}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  max={discountType === "Percentage" ? 100 : undefined}
                  step={0.01}
                  placeholder={discountType === "Percentage" ? "20" : "10.00"}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
