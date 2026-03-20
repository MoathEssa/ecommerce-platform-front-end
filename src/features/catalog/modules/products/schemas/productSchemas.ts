import { z } from "zod";

// ── Product info form ─────────────────────────────────────────────────────────

export const productFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Max 200 characters"),
  slug: z
    .string()
    .regex(/^[a-z0-9-]*$/, "Only lowercase letters, numbers, and hyphens")
    .min(1, "Slug is required"),
  description: z
    .string()
    .max(2000, "Max 2000 characters")
    .optional()
    .or(z.literal("")),
  brand: z.string().max(100, "Max 100 characters").optional().or(z.literal("")),
});

export type ProductFormValues = z.output<typeof productFormSchema>;
export type ProductFormInput = z.input<typeof productFormSchema>;

// ── Variant form ──────────────────────────────────────────────────────────────

export const variantFormSchema = z.object({
  options: z
    .array(
      z.object({
        key: z.string().min(1, "Option name required"),
        value: z.string().min(1, "Option value required"),
      }),
    )
    .min(1, "At least one option is required"),
  basePrice: z.coerce.number().positive("Price must be positive"),
  currencyCode: z
    .string()
    .length(3, "Must be a 3-letter ISO code")
    .transform((v) => v.toUpperCase()),
  isActive: z.boolean(),
  initialStock: z.coerce.number().int().min(0, "Stock cannot be negative"),
});

export type VariantFormValues = z.output<typeof variantFormSchema>;
export type VariantFormInput = z.input<typeof variantFormSchema>;
