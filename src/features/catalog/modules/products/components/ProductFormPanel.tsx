import { Loader2 } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import type {
  ProductFormValues,
  ProductFormInput,
} from "../schemas/productSchemas";

import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@shared/ui/form";
import { Skeleton } from "@shared/ui/skeleton";

// ── Props ─────────────────────────────────────────────────────────────────────

interface ProductFormPanelProps {
  form: UseFormReturn<ProductFormInput, unknown, ProductFormValues>;
  isLoading?: boolean;
  isSaving: boolean;
  onTitleBlur: (title: string) => void;
  onSubmit: (values: ProductFormValues) => Promise<void>;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ProductFormPanel({
  form,
  isLoading,
  isSaving,
  onTitleBlur,
  onSubmit,
}: ProductFormPanelProps) {
  if (isLoading) {
    return (
      <div className="space-y-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Title <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Classic Leather Sneakers"
                  {...field}
                  onBlur={(e) => {
                    field.onBlur();
                    onTitleBlur(e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Slug */}
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Slug <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="classic-leather-sneakers"
                  className="font-mono text-sm"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-xs">
                Auto-generated from title. Changing it may break existing links.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Brand */}
        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Nike"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <textarea
                  rows={5}
                  placeholder="Describe the product…"
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
