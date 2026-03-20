import { Loader2, Truck } from "lucide-react";
import { Button } from "@shared/ui/button";
import { Checkbox } from "@shared/ui/checkbox";
import { Label } from "@shared/ui/label";
import AddressForm from "./AddressForm";
import ContactSection from "./ContactSection";
import type { CheckoutAddress } from "../../types";

interface Props {
  isGuest: boolean;
  email: string;
  onEmailChange: (email: string) => void;
  shippingAddress: CheckoutAddress;
  onShippingChange: (address: CheckoutAddress) => void;
  useSameAddress: boolean;
  onSameAddressChange: (value: boolean) => void;
  billingAddress: CheckoutAddress;
  onBillingChange: (address: CheckoutAddress) => void;
  loadingFreight: boolean;
  onContinue: () => void;
}

export default function AddressStep({
  isGuest,
  email,
  onEmailChange,
  shippingAddress,
  onShippingChange,
  useSameAddress,
  onSameAddressChange,
  billingAddress,
  onBillingChange,
  loadingFreight,
  onContinue,
}: Props) {
  return (
    <>
      {isGuest && <ContactSection email={email} onChange={onEmailChange} />}

      <div className="rounded-xl border bg-card p-6">
        <AddressForm
          title="Shipping Address"
          address={shippingAddress}
          onChange={onShippingChange}
        />
      </div>

      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id="same-address"
            checked={useSameAddress}
            onCheckedChange={(val) => onSameAddressChange(val === true)}
          />
          <Label htmlFor="same-address" className="text-sm cursor-pointer">
            Billing address same as shipping
          </Label>
        </div>
        {!useSameAddress && (
          <AddressForm
            title="Billing Address"
            address={billingAddress}
            onChange={onBillingChange}
          />
        )}
      </div>

      <Button
        type="button"
        size="lg"
        className="w-full gap-2"
        onClick={onContinue}
        disabled={loadingFreight}
      >
        {loadingFreight ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Truck className="h-4 w-4" />
        )}
        {loadingFreight ? "Loading shipping options…" : "Continue to Shipping"}
      </Button>
    </>
  );
}
