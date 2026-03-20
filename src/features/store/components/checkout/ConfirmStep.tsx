import { Loader2, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@shared/ui/button";
import { Separator } from "@shared/ui/separator";
import type { CheckoutAddress, FreightOptionDto } from "../../types";

interface Props {
  shippingAddress: CheckoutAddress;
  chosenOption: FreightOptionDto | undefined;
  placing: boolean;
  onBack: () => void;
}

export default function ConfirmStep({
  shippingAddress,
  chosenOption,
  placing,
  onBack,
}: Props) {
  return (
    <div className="rounded-xl border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">
          Review Your Order
        </h3>
        <button
          type="button"
          className="text-xs text-primary underline-offset-2 hover:underline"
          onClick={onBack}
        >
          ← Edit shipping
        </button>
      </div>

      {/* Address summary */}
      <div className="space-y-1 text-sm">
        <p className="text-muted-foreground font-medium">Shipping to</p>
        <p className="text-foreground">
          {shippingAddress.fullName} — {shippingAddress.line1},{" "}
          {shippingAddress.city}, {shippingAddress.country}
        </p>
      </div>

      {/* Chosen shipping */}
      {chosenOption && (
        <>
          <Separator />
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Truck className="h-4 w-4" />
              <span>{chosenOption.logisticName}</span>
              <span className="text-xs">
                ({chosenOption.logisticAging} days)
              </span>
            </div>
            <span className="font-semibold">
              ${chosenOption.logisticPrice.toFixed(2)} USD
            </span>
          </div>
        </>
      )}

      <Separator />

      <Button
        type="submit"
        size="lg"
        className="w-full gap-2"
        disabled={placing}
      >
        {placing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ShieldCheck className="h-4 w-4" />
        )}
        Place Order
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Secure checkout powered by Stripe
      </p>
    </div>
  );
}
