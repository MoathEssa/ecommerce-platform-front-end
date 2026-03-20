import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useGetCartQuery } from "../api/cartApi";
import {
  usePlaceOrderMutation,
  useCalculateFreightMutation,
} from "../api/checkoutApi";
import { useAppSelector } from "@app/store";
import OrderSummary from "../components/checkout/OrderSummary";
import CheckoutStepper from "../components/checkout/CheckoutStepper";
import CheckoutSkeleton from "../components/checkout/CheckoutSkeleton";
import CheckoutEmptyState from "../components/checkout/CheckoutEmptyState";
import AddressStep from "../components/checkout/AddressStep";
import ShippingStep from "../components/checkout/ShippingStep";
import ConfirmStep from "../components/checkout/ConfirmStep";
import type { CheckoutAddress, FreightOptionDto } from "../types";

type Step = "address" | "shipping" | "confirm";

const EMPTY_ADDRESS: CheckoutAddress = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  region: "",
  postalCode: "",
  country: "SA",
};

export default function StoreCheckoutPage() {
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const { data: cart, isLoading: cartLoading } = useGetCartQuery();
  const [placeOrder, { isLoading: placing }] = usePlaceOrderMutation();
  const [calculateFreight, { isLoading: loadingFreight }] =
    useCalculateFreightMutation();

  const [step, setStep] = useState<Step>("address");
  const [email, setEmail] = useState(user?.email ?? "");
  const [shippingAddress, setShippingAddress] =
    useState<CheckoutAddress>(EMPTY_ADDRESS);
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [billingAddress, setBillingAddress] =
    useState<CheckoutAddress>(EMPTY_ADDRESS);
  const [freightOptions, setFreightOptions] = useState<FreightOptionDto[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<string | null>(null);

  // Step 1 - 2
  const handleContinueToShipping = async () => {
    if (
      !shippingAddress.fullName ||
      !shippingAddress.line1 ||
      !shippingAddress.city
    ) {
      toast.error("Please fill in the required shipping address fields.");
      return;
    }
    if (!cart || cart.items.length === 0) return;

    const options = await calculateFreight({
      items: cart.items.map((i) => ({
        variantId: i.variantId,
        quantity: i.quantity,
      })),
      endCountryCode: shippingAddress.country,
      zip: shippingAddress.postalCode || undefined,
    }).unwrap();

    setFreightOptions(options);
    setSelectedShipping(options.length > 0 ? options[0].logisticName : null);
    setStep("shipping");
  };

  // Step 2 - 3
  const handleContinueToConfirm = () => {
    if (freightOptions.length > 0 && !selectedShipping) {
      toast.error("Please select a shipping method.");
      return;
    }
    setStep("confirm");
  };

  // Step 3: place order
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart || cart.items.length === 0) return;

    const result = await placeOrder({
      email: email || undefined,
      items: cart.items.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      })),
      shippingAddress,
      billingAddress: useSameAddress ? undefined : billingAddress,
      couponCode: cart.coupon?.code,
    }).unwrap();

    navigate("/store/checkout/payment", {
      state: {
        orderNumber: result.orderNumber,
        total: result.total,
        currencyCode: result.currencyCode,
        clientSecret: result.payment.clientSecret,
        selectedShipping,
      },
    });
  };

  if (cartLoading) return <CheckoutSkeleton />;
  if (!cart || cart.items.length === 0) return <CheckoutEmptyState />;

  const chosenOption = freightOptions.find(
    (o) => o.logisticName === selectedShipping,
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
        Checkout
      </h1>

      <CheckoutStepper step={step} />

      <form onSubmit={handlePlaceOrder}>
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-8">
            {step === "address" && (
              <AddressStep
                isGuest={!user}
                email={email}
                onEmailChange={setEmail}
                shippingAddress={shippingAddress}
                onShippingChange={setShippingAddress}
                useSameAddress={useSameAddress}
                onSameAddressChange={setUseSameAddress}
                billingAddress={billingAddress}
                onBillingChange={setBillingAddress}
                loadingFreight={loadingFreight}
                onContinue={handleContinueToShipping}
              />
            )}

            {step === "shipping" && (
              <ShippingStep
                options={freightOptions}
                selected={selectedShipping}
                onSelect={setSelectedShipping}
                onBack={() => setStep("address")}
                onContinue={handleContinueToConfirm}
              />
            )}

            {step === "confirm" && (
              <ConfirmStep
                shippingAddress={shippingAddress}
                chosenOption={chosenOption}
                placing={placing}
                onBack={() => setStep("shipping")}
              />
            )}
          </div>

          <div className="lg:col-span-2 space-y-4 lg:sticky lg:top-24 self-start">
            <OrderSummary cart={cart} shippingOption={chosenOption} />
          </div>
        </div>
      </form>
    </div>
  );
}
