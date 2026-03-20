import { useState } from "react";
import { Tag, X, Loader2 } from "lucide-react";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import {
  useApplyCouponMutation,
  useRemoveCouponMutation,
} from "../../api/cartApi";
import type { CartCouponDto } from "../../types";

interface CouponInputProps {
  activeCoupon: CartCouponDto | null;
}

export default function CouponInput({ activeCoupon }: CouponInputProps) {
  const [code, setCode] = useState("");
  const [applyCoupon, { isLoading: isApplying }] = useApplyCouponMutation();
  const [removeCoupon, { isLoading: isRemoving }] = useRemoveCouponMutation();

  const handleApply = async () => {
    if (!code.trim()) return;
    await applyCoupon(code.trim()).unwrap();
  };

  if (activeCoupon) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900 p-3">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-green-600" />
          <div>
            <p className="text-sm font-medium text-green-700 dark:text-green-400">
              {activeCoupon.code}
            </p>
            {activeCoupon.description && (
              <p className="text-xs text-green-600/80 dark:text-green-500/80">
                {activeCoupon.description}
              </p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-green-600 hover:text-destructive"
          disabled={isRemoving}
          onClick={() => removeCoupon()}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Coupon code"
        className="flex-1"
        onKeyDown={(e) => e.key === "Enter" && handleApply()}
      />
      <Button
        variant="outline"
        onClick={handleApply}
        disabled={!code.trim() || isApplying}
      >
        {isApplying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
      </Button>
    </div>
  );
}
