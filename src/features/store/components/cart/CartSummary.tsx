import { Link } from "react-router-dom";
import { Separator } from "@shared/ui/separator";
import { Button } from "@shared/ui/button";
import { formatPrice } from "../../lib/formatPrice";
import type { CartDto } from "../../types";

interface CartSummaryProps {
  cart: CartDto;
}

export default function CartSummary({ cart }: CartSummaryProps) {
  return (
    <div className="rounded-2xl border bg-card p-6 space-y-4 shadow-sm">
      <h3 className="text-lg font-bold text-foreground">Order Summary</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            Subtotal ({cart.itemCount} items)
          </span>
          <span className="font-medium">
            {formatPrice(cart.subtotal, cart.currencyCode)}
          </span>
        </div>

        {cart.discountTotal > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-{formatPrice(cart.discountTotal, cart.currencyCode)}</span>
          </div>
        )}

        <div className="flex justify-between text-muted-foreground">
          <span>Shipping</span>
          <span>Calculated at checkout</span>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between text-base font-bold">
        <span>Total</span>
        <span>{formatPrice(cart.total, cart.currencyCode)}</span>
      </div>

      <Button
        size="lg"
        className="w-full rounded-xl shadow-lg shadow-primary/20"
        asChild
      >
        <Link to="/store/checkout">Proceed to Checkout</Link>
      </Button>
    </div>
  );
}
