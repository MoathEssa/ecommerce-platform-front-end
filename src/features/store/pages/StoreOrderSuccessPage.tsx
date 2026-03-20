import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { Button } from "@shared/ui/button";
import { useClearCartMutation } from "../api/cartApi";
import { formatPrice } from "../lib/formatPrice";

interface OrderSuccessState {
  orderNumber: string;
  total: number;
  currencyCode: string;
}

export default function StoreOrderSuccessPage() {
  const location = useLocation();
  const state = location.state as OrderSuccessState | null;
  const [clearCart] = useClearCartMutation();
  const clearedRef = useRef(false);

  useEffect(() => {
    if (!clearedRef.current) {
      clearedRef.current = true;
      clearCart();
    }
  }, [clearCart]);

  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-green-100 dark:bg-green-950/30 mb-6 shadow-lg shadow-green-500/10">
        <CheckCircle2 className="h-10 w-10 text-green-600" />
      </div>

      <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">
        Order Placed Successfully!
      </h1>

      {state?.orderNumber && (
        <p className="mt-3 text-lg text-muted-foreground">
          Order #{state.orderNumber}
        </p>
      )}

      {state?.total != null && (
        <p className="mt-1 text-2xl font-bold text-foreground">
          {formatPrice(state.total, state.currencyCode)}
        </p>
      )}

      <p className="mt-4 max-w-md text-sm text-muted-foreground leading-relaxed">
        Thank you for your purchase! Your order is being processed. You will
        receive a confirmation email shortly with your payment details.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button
          asChild
          className="gap-2 rounded-xl px-8 shadow-lg shadow-primary/20"
        >
          <Link to="/store">
            <ShoppingBag className="h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>
      </div>
    </div>
  );
}
