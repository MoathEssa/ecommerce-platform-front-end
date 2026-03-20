import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, TrendingUp } from "lucide-react";

import { useCreateAdjustmentMutation } from "../api/inventoryApi";
import type { InventoryListItemDto } from "../types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@shared/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@shared/ui/form";
import { Input } from "@shared/ui/input";
import { Button } from "@shared/ui/button";

const schema = z.object({
  delta: z
    .number({ invalid_type_error: "Please enter a valid number" })
    .int("Must be a whole number")
    .refine((v) => v !== 0, { message: "Delta must not be zero" }),
  reason: z
    .string()
    .min(3, "Reason must be at least 3 characters")
    .max(200, "Maximum 200 characters"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  item: InventoryListItemDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AdjustmentDialog({ item, open, onOpenChange }: Props) {
  const [createAdjustment, { isLoading }] = useCreateAdjustmentMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { delta: 1, reason: "" },
  });

  useEffect(() => {
    if (open) {
      form.reset({ delta: 1, reason: "" });
    }
  }, [open, form]);

  async function onSubmit(values: FormValues) {
    if (!item) return;
    await createAdjustment({ variantId: item.variantId, ...values }).unwrap();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
            Adjust Stock
          </DialogTitle>
          {item && (
            <DialogDescription>
              Adjusting inventory for{" "}
              <span className="font-medium text-foreground">
                {item.productTitle}
              </span>
              <span className="font-mono text-xs ml-1">({item.sku})</span>
              <br />
              Current available:{" "}
              <span className="font-semibold text-foreground">
                {item.available}
              </span>
            </DialogDescription>
          )}
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-1"
          >
            <FormField
              control={form.control}
              name="delta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity Change</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. 10 or -5"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10) || 0)
                      }
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Use a positive number to add stock, negative to remove.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Received new shipment, Damaged goods…"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Apply Adjustment
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
