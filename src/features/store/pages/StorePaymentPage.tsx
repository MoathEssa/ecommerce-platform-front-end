import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@shared/ui/button";
import { formatPrice } from "../lib/formatPrice";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string,
);

interface PaymentState {
  orderNumber: string;
  total: number;
  currencyCode: string;
  clientSecret: string;
}

// ── Inner form rendered inside <Elements> ─────────────────────────────────────

function PaymentForm({
  orderNumber,
  total,
  currencyCode,
}: Omit<PaymentState, "clientSecret">) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [paying, setPaying] = useState(false);
  const [elementReady, setElementReady] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !elementReady) return;

    setPaying(true);
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Stripe will redirect here for 3DS flows; state is preserved when
          // redirect: "if_required" avoids the redirect for non-3DS cards.
          return_url: `${window.location.origin}/store/checkout/success`,
        },
        redirect: "if_required",
      });

      if (error) {
        toast.error(error.message ?? "Payment failed. Please try again.");
      } else {
        navigate("/store/checkout/success", {
          replace: true,
          state: { orderNumber, total, currencyCode },
        });
      }
    } finally {
      setPaying(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement onReady={() => setElementReady(true)} />

      <Button
        type="submit"
        size="lg"
        className="w-full gap-2"
        disabled={!stripe || !elements || !elementReady || paying}
      >
        {paying ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ShieldCheck className="h-4 w-4" />
        )}
        Pay {formatPrice(total, currencyCode)}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Secure checkout powered by Stripe
      </p>
    </form>
  );
}

// ── Page shell ────────────────────────────────────────────────────────────────

export default function StorePaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as PaymentState | null;

  // Guard: if we land here without a clientSecret, send back to checkout
  useEffect(() => {
    if (!state?.clientSecret) {
      navigate("/store/checkout", { replace: true });
    }
  }, [state, navigate]);

  if (!state?.clientSecret) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="mx-auto max-w-lg px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
            Complete Payment
          </h1>
          <p className="text-sm text-muted-foreground">
            Order{" "}
            <span className="font-semibold text-foreground">
              #{state.orderNumber}
            </span>{" "}
            &bull;{" "}
            <span className="font-semibold text-foreground">
              {formatPrice(state.total, state.currencyCode)}
            </span>
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-8 shadow-sm">
          <Elements
            stripe={stripePromise}
            options={{ clientSecret: state.clientSecret }}
          >
            <PaymentForm
              orderNumber={state.orderNumber}
              total={state.total}
              currencyCode={state.currencyCode}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
}
