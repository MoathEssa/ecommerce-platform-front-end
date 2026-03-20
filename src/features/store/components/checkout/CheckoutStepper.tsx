import { Check } from "lucide-react";

export type CheckoutStep = "address" | "shipping" | "confirm";

interface Props {
  step: CheckoutStep;
}

const STEPS: { key: CheckoutStep; label: string }[] = [
  { key: "address", label: "Address" },
  { key: "shipping", label: "Shipping" },
  { key: "confirm", label: "Confirm" },
];

export default function CheckoutStepper({ step }: Props) {
  const currentIdx = STEPS.findIndex((s) => s.key === step);

  return (
    <div className="mb-10 flex items-center justify-center gap-0">
      {STEPS.map((s, i) => {
        const isCompleted = i < currentIdx;
        const isCurrent = i === currentIdx;
        return (
          <div key={s.key} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={[
                  "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors",
                  isCompleted
                    ? "bg-primary text-primary-foreground"
                    : isCurrent
                      ? "border-2 border-primary text-primary bg-primary/10"
                      : "border-2 border-muted-foreground/30 text-muted-foreground/50",
                ].join(" ")}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={[
                  "text-xs font-medium",
                  isCurrent
                    ? "text-primary"
                    : isCompleted
                      ? "text-foreground"
                      : "text-muted-foreground",
                ].join(" ")}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={[
                  "mx-3 h-0.5 w-12 sm:w-20 rounded-full",
                  i < currentIdx ? "bg-primary" : "bg-muted-foreground/20",
                ].join(" ")}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
