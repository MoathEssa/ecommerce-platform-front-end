import { Button } from "@shared/ui/button";
import ShippingSelector from "./ShippingSelector";
import type { FreightOptionDto } from "../../types";

interface Props {
  options: FreightOptionDto[];
  selected: string | null;
  onSelect: (value: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

export default function ShippingStep({
  options,
  selected,
  onSelect,
  onBack,
  onContinue,
}: Props) {
  return (
    <div className="rounded-xl border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">
          Choose Shipping Method
        </h3>
        <button
          type="button"
          className="text-xs text-primary underline-offset-2 hover:underline"
          onClick={onBack}
        >
          ← Edit address
        </button>
      </div>

      <p className="text-sm text-muted-foreground">
        Prices are estimated and displayed in USD. Actual billing may vary.
      </p>

      <ShippingSelector
        options={options}
        selected={selected}
        onSelect={onSelect}
      />

      <Button
        type="button"
        size="lg"
        className="w-full mt-2"
        onClick={onContinue}
      >
        Continue to Confirm
      </Button>
    </div>
  );
}
