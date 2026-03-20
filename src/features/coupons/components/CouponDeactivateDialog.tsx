import { useState } from "react";

import { useAdminDeactivateCouponMutation } from "@features/coupons/api/couponsApi";
import { extractApiError } from "@shared/lib/utils";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@shared/ui/alert-dialog";

// ── Props ─────────────────────────────────────────────────────────────────────

interface CouponDeactivateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon: { id: number; code: string } | null;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CouponDeactivateDialog({
  open,
  onOpenChange,
  coupon,
}: CouponDeactivateDialogProps) {
  const [deactivateCoupon, { isLoading }] = useAdminDeactivateCouponMutation();
  const [apiError, setApiError] = useState<string | null>(null);

  async function handleConfirm() {
    if (!coupon) return;
    setApiError(null);
    try {
      await deactivateCoupon(coupon.id).unwrap();
      onOpenChange(false);
    } catch (err) {
      setApiError(extractApiError(err));
    }
  }

  function handleOpenChange(next: boolean) {
    if (!next) setApiError(null);
    onOpenChange(next);
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Deactivate coupon?</AlertDialogTitle>
          <AlertDialogDescription>
            Coupon <strong className="font-mono">{coupon?.code}</strong> will be
            deactivated and customers will no longer be able to use it. You can
            re-enable it by editing the coupon.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {apiError && (
          <p className="text-sm text-destructive px-1">{apiError}</p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {isLoading ? "Deactivating…" : "Deactivate"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
