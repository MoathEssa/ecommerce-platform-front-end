import { Truck } from "lucide-react";
import { Separator } from "@shared/ui/separator";
import { formatPrice } from "../../lib/formatPrice";
import CouponInput from "../cart/CouponInput";
import type { CartDto, FreightOptionDto } from "../../types";

interface OrderSummaryProps {
  cart: CartDto;
  shippingOption?: FreightOptionDto | null;
}

export default function OrderSummary({
  cart,
  shippingOption,
}: OrderSummaryProps) {
  return (
    <div className="rounded-xl border bg-card p-6 space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Order Summary</h3>

      {/* Items */}
      <div className="space-y-3">
        {cart.items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted/50 border">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.productTitle}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs text-muted-foreground">N/A</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {item.productTitle}
              </p>
              <p className="text-xs text-muted-foreground">
                {Object.values(item.options).join(" / ")} &times;{" "}
                {item.quantity}
              </p>
            </div>
            <p className="text-sm font-medium shrink-0">
              {formatPrice(item.lineTotal, cart.currencyCode)}
            </p>
          </div>
        ))}
      </div>

      <Separator />

      {/* Coupon */}
      <CouponInput activeCoupon={cart.coupon} />

      <Separator />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(cart.subtotal, cart.currencyCode)}</span>
        </div>
        {cart.discountTotal > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount ({cart.coupon?.code})</span>
            <span>-{formatPrice(cart.discountTotal, cart.currencyCode)}</span>
          </div>
        )}
        {shippingOption ? (
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Truck className="h-3.5 w-3.5" />
              {shippingOption.logisticName}
            </span>
            <span>${shippingOption.logisticPrice.toFixed(2)} USD</span>
          </div>
        ) : (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span className="text-muted-foreground italic">Select method</span>
          </div>
        )}
      </div>

      <Separator />

      <div className="flex justify-between text-base font-bold">
        <span>Total</span>
        <span>{formatPrice(cart.total, cart.currencyCode)}</span>
      </div>

      {shippingOption && (
        <p className="text-xs text-muted-foreground">
          * Shipping fee estimated in USD and billed separately.
        </p>
      )}
    </div>
  );
}
