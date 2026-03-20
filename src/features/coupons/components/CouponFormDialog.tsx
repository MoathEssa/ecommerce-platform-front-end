import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  useAdminCreateCouponMutation,
  useAdminUpdateCouponMutation,
} from "@features/coupons/api/couponsApi";
import { useAdminGetCategoriesQuery } from "@features/catalog/api/catalogApi";
import type { CouponDetailDto } from "@features/coupons/types";
import {
  couponFormSchema,
  type CouponFormValues,
  type CouponFormInput,
  parseIdList,
  formatIdList,
} from "@features/coupons/schemas/couponSchemas";
import { extractApiError } from "@shared/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@shared/ui/dialog";
import { Form } from "@shared/ui/form";
import { Button } from "@shared/ui/button";
import { Separator } from "@shared/ui/separator";
import { ScrollArea } from "@shared/ui/scroll-area";

import CouponBasicFields from "./form/CouponBasicFields";
import CouponLimitsFields from "./form/CouponLimitsFields";
import CouponDateFields from "./form/CouponDateFields";
import CouponApplicabilityFields from "./form/CouponApplicabilityFields";

// ── Props ─────────────────────────────────────────────────────────────────────

interface CouponFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  coupon?: CouponDetailDto | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function toDateInputValue(iso: string | null | undefined): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CouponFormDialog({
  open,
  onOpenChange,
  mode,
  coupon,
}: CouponFormDialogProps) {
  const [createCoupon, { isLoading: isCreating }] =
    useAdminCreateCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] =
    useAdminUpdateCouponMutation();
  const { data: adminCats = [] } = useAdminGetCategoriesQuery();

  const isLoading = isCreating || isUpdating;

  const form = useForm<CouponFormInput, unknown, CouponFormValues>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      code: "",
      discountType: "Percentage",
      discountValue: undefined as unknown as number,
      minOrderAmount: undefined,
      maxDiscountAmount: undefined,
      usageLimit: undefined,
      perUserLimit: 1 as unknown as number,
      isActive: true,
      startsAt: "",
      expiresAt: "",
      applicableCategoryIds: "",
      applicableProductIds: "",
      applicableVariantIds: "",
    },
  });

  useEffect(() => {
    if (open && mode === "edit" && coupon) {
      form.reset({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue as unknown as number,
        minOrderAmount: (coupon.minOrderAmount ??
          undefined) as unknown as number,
        maxDiscountAmount: (coupon.maxDiscountAmount ??
          undefined) as unknown as number,
        usageLimit: (coupon.usageLimit ?? undefined) as unknown as number,
        perUserLimit: coupon.perUserLimit as unknown as number,
        isActive: coupon.isActive,
        startsAt: toDateInputValue(coupon.startsAt),
        expiresAt: toDateInputValue(coupon.expiresAt),
        applicableCategoryIds: formatIdList(
          coupon.applicableCategories.map((c) => c.id),
        ),
        applicableProductIds: formatIdList(
          coupon.applicableProducts.map((p) => p.id),
        ),
        applicableVariantIds: formatIdList(
          coupon.applicableVariants.map((v) => v.id),
        ),
      });
    } else if (open && mode === "create") {
      form.reset({
        code: "",
        discountType: "Percentage",
        discountValue: undefined as unknown as number,
        minOrderAmount: undefined,
        maxDiscountAmount: undefined,
        usageLimit: undefined,
        perUserLimit: 1 as unknown as number,
        isActive: true,
        startsAt: "",
        expiresAt: "",
        applicableCategoryIds: "",
        applicableProductIds: "",
        applicableVariantIds: "",
      });
    }
  }, [open, mode, coupon, form]);

  async function onSubmit(values: CouponFormValues) {
    const body = {
      code: values.code.toUpperCase().trim(),
      discountType: values.discountType,
      discountValue: values.discountValue,
      minOrderAmount: values.minOrderAmount ?? null,
      maxDiscountAmount: values.maxDiscountAmount ?? null,
      usageLimit: values.usageLimit ?? null,
      perUserLimit: values.perUserLimit,
      isActive: values.isActive,
      startsAt: values.startsAt
        ? new Date(values.startsAt).toISOString()
        : null,
      expiresAt: values.expiresAt
        ? new Date(values.expiresAt).toISOString()
        : null,
      applicableCategories: parseIdList(values.applicableCategoryIds ?? ""),
      applicableProducts: parseIdList(values.applicableProductIds ?? ""),
      applicableVariants: parseIdList(values.applicableVariantIds ?? ""),
    };

    try {
      if (mode === "create") {
        await createCoupon(body).unwrap();
      } else {
        await updateCoupon({ id: coupon!.id, ...body }).unwrap();
      }
      onOpenChange(false);
    } catch (err) {
      form.setError("root", { message: extractApiError(err) });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Coupon" : "Edit Coupon"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto pr-1">
          <Form {...form}>
            <form
              id="coupon-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 py-1 px-1"
            >
              <CouponBasicFields form={form} />
              <CouponLimitsFields form={form} />
              <CouponDateFields form={form} />
              <Separator />
              <CouponApplicabilityFields
                form={form}
                adminCategories={adminCats}
              />
            </form>
          </Form>
        </ScrollArea>

        {form.formState.errors.root && (
          <p className="text-sm text-destructive px-1">
            {form.formState.errors.root.message}
          </p>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" form="coupon-form" disabled={isLoading}>
            {isLoading
              ? mode === "create"
                ? "Creating…"
                : "Saving…"
              : mode === "create"
                ? "Create Coupon"
                : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
