import { Truck, Clock, BadgeCheck } from "lucide-react";
import type { FreightOptionDto } from "../../types";

interface ShippingSelectorProps {
  options: FreightOptionDto[];
  selected: string | null;
  onSelect: (logisticName: string) => void;
}

export default function ShippingSelector({
  options,
  selected,
  onSelect,
}: ShippingSelectorProps) {
  if (options.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-2">
        No shipping options available for this destination.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {options.map((opt) => {
        const isSelected = selected === opt.logisticName;
        return (
          <button
            key={opt.logisticName}
            type="button"
            onClick={() => onSelect(opt.logisticName)}
            className={[
              "w-full flex items-center gap-4 rounded-lg border p-4 text-left transition-colors",
              isSelected
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border hover:border-primary/50 hover:bg-muted/30",
            ].join(" ")}
          >
            {/* Radio indicator */}
            <span
              className={[
                "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                isSelected ? "border-primary" : "border-muted-foreground/40",
              ].join(" ")}
            >
              {isSelected && (
                <span className="h-2 w-2 rounded-full bg-primary" />
              )}
            </span>

            {/* Carrier icon */}
            <Truck
              className={[
                "h-5 w-5 shrink-0",
                isSelected ? "text-primary" : "text-muted-foreground",
              ].join(" ")}
            />

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {opt.logisticName}
                </span>
                {isSelected && <BadgeCheck className="h-4 w-4 text-primary" />}
              </div>
              <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{opt.logisticAging} business days</span>
              </div>
              {(opt.taxesFee != null || opt.clearanceOperationFee != null) && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {opt.taxesFee != null && `Taxes: $${opt.taxesFee.toFixed(2)}`}
                  {opt.taxesFee != null &&
                    opt.clearanceOperationFee != null &&
                    "  •  "}
                  {opt.clearanceOperationFee != null &&
                    `Clearance: $${opt.clearanceOperationFee.toFixed(2)}`}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-foreground">
                ${opt.logisticPrice.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">USD</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
