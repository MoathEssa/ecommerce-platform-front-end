import { z } from "zod";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Parses a comma/newline separated string of integers into a number array.
 *  Silently drops non-numeric tokens. Returns empty array for blank input. */
export function parseIdList(value: string): number[] {
  if (!value.trim()) return [];
  return value
    .split(/[\s,]+/)
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !isNaN(n) && n > 0);
}

/** Serialises a number array back to a comma-separated string for form display. */
export function formatIdList(ids: number[]): string {
  return ids.join(", ");
}

// ── Schema ────────────────────────────────────────────────────────────────────

export const couponFormSchema = z
  .object({
    code: z
      .string()
      .min(1, "Code is required")
      .max(64, "Code must be 64 characters or less")
      .regex(
        /^[A-Za-z0-9_-]+$/,
        "Only letters, digits, hyphens, and underscores allowed",
      ),
    discountType: z.enum(["Percentage", "FixedAmount"], {
      required_error: "Discount type is required",
    }),
    discountValue: z.coerce
      .number({ invalid_type_error: "Must be a number" })
      .positive("Must be greater than 0"),
    minOrderAmount: z.coerce
      .number({ invalid_type_error: "Must be a number" })
      .nonnegative("Must be 0 or greater")
      .nullable()
      .optional(),
    maxDiscountAmount: z.coerce
      .number({ invalid_type_error: "Must be a number" })
      .positive("Must be greater than 0")
      .nullable()
      .optional(),
    usageLimit: z.coerce
      .number({ invalid_type_error: "Must be a number" })
      .int("Must be a whole number")
      .positive("Must be greater than 0")
      .nullable()
      .optional(),
    perUserLimit: z.coerce
      .number({ invalid_type_error: "Must be a number" })
      .int("Must be a whole number")
      .positive("Must be at least 1"),
    isActive: z.boolean(),
    startsAt: z.string().optional().or(z.literal("")),
    expiresAt: z.string().optional().or(z.literal("")),
    // Applicability — stored as comma-sep strings, parsed before submit
    applicableCategoryIds: z.string().optional().default(""),
    applicableProductIds: z.string().optional().default(""),
    applicableVariantIds: z.string().optional().default(""),
  })
  .refine(
    (data) => {
      if (data.discountType === "Percentage" && data.discountValue > 100)
        return false;
      return true;
    },
    {
      message: "Percentage discount must be between 0 and 100",
      path: ["discountValue"],
    },
  )
  .refine(
    (data) => {
      if (data.startsAt && data.expiresAt && data.expiresAt <= data.startsAt)
        return false;
      return true;
    },
    {
      message: "Expiry date must be after start date",
      path: ["expiresAt"],
    },
  );

export type CouponFormValues = z.output<typeof couponFormSchema>;
export type CouponFormInput = z.input<typeof couponFormSchema>;
