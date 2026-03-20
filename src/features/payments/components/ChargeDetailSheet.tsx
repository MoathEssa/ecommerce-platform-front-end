import { format, parseISO } from "date-fns";
import {
  CreditCard,
  Receipt,
  ShieldAlert,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

import { useAdminGetChargeByIdQuery } from "@features/payments/api/paymentsApi";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@shared/ui/sheet";
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import { Separator } from "@shared/ui/separator";
import { ScrollArea } from "@shared/ui/scroll-area";
import { Skeleton } from "@shared/ui/skeleton";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amount / 100);
}

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return format(parseISO(iso), "dd MMM yyyy, HH:mm");
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm font-medium text-right break-all">
        {value ?? "—"}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    succeeded:
      "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    pending:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
    failed: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  };
  return (
    <Badge
      variant="outline"
      className={`font-normal capitalize text-xs ${map[status] ?? "bg-muted text-muted-foreground"}`}
    >
      {status}
    </Badge>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border bg-card p-3">
      <div className="mt-0.5 rounded-md bg-muted p-1.5">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-base font-semibold leading-tight">{value}</p>
      </div>
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface ChargeDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chargeId: string | null;
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ChargeDetailSheet({
  open,
  onOpenChange,
  chargeId,
}: ChargeDetailSheetProps) {
  const { data: charge, isLoading } = useAdminGetChargeByIdQuery(
    chargeId ?? "",
    { skip: !chargeId },
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl flex flex-col gap-0 p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Charge Details
          </SheetTitle>
        </SheetHeader>

        {isLoading || !charge ? (
          <div className="flex-1 px-6 pt-4 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-8 rounded-md" />
            ))}
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <div className="px-6 py-4 space-y-6">
              {/* ── Header summary ──────────────────────────────────────── */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    {formatAmount(charge.amount, charge.currency)}
                  </p>
                  <p className="text-xs font-mono text-muted-foreground mt-0.5">
                    {charge.id}
                  </p>
                </div>
                <StatusBadge status={charge.status} />
              </div>

              {/* ── Stat cards ──────────────────────────────────────────── */}
              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  icon={Receipt}
                  label="Captured"
                  value={formatAmount(charge.amountCaptured, charge.currency)}
                />
                <StatCard
                  icon={RefreshCw}
                  label="Refunded"
                  value={formatAmount(charge.amountRefunded, charge.currency)}
                />
                {charge.disputed && (
                  <StatCard icon={ShieldAlert} label="Disputed" value="Yes" />
                )}
              </div>

              <Separator />

              {/* ── Charge details ──────────────────────────────────────── */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Charge
                </p>
                <div className="divide-y">
                  <DetailRow label="Date" value={fmtDate(charge.created)} />
                  <DetailRow
                    label="Currency"
                    value={charge.currency.toUpperCase()}
                  />
                  <DetailRow
                    label="Description"
                    value={charge.description ?? "—"}
                  />
                  <DetailRow
                    label="Statement Descriptor"
                    value={
                      charge.statementDescriptor ??
                      charge.statementDescriptorSuffix ??
                      "—"
                    }
                  />
                  {charge.receiptUrl && (
                    <DetailRow
                      label="Receipt"
                      value={
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-sm"
                          asChild
                        >
                          <a
                            href={charge.receiptUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View receipt
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </Button>
                      }
                    />
                  )}
                </div>
              </div>

              <Separator />

              {/* ── Payment method ──────────────────────────────────────── */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Payment Method
                </p>
                {charge.paymentMethodDetails?.card ? (
                  <div className="divide-y">
                    <DetailRow
                      label="Brand"
                      value={
                        <span className="capitalize">
                          {charge.paymentMethodDetails.card.brand ?? "—"}
                        </span>
                      }
                    />
                    <DetailRow
                      label="Number"
                      value={`•••• •••• •••• ${charge.paymentMethodDetails.card.last4}`}
                    />
                    <DetailRow
                      label="Expires"
                      value={`${charge.paymentMethodDetails.card.expMonth}/${charge.paymentMethodDetails.card.expYear}`}
                    />
                    <DetailRow
                      label="Funding"
                      value={
                        <span className="capitalize">
                          {charge.paymentMethodDetails.card.funding ?? "—"}
                        </span>
                      }
                    />
                    <DetailRow
                      label="Country"
                      value={charge.paymentMethodDetails.card.country ?? "—"}
                    />
                    <DetailRow
                      label="Network"
                      value={
                        <span className="capitalize">
                          {charge.paymentMethodDetails.card.network ?? "—"}
                        </span>
                      }
                    />
                  </div>
                ) : (
                  <div className="divide-y">
                    <DetailRow
                      label="Type"
                      value={
                        <span className="capitalize">
                          {charge.paymentMethodDetails?.type ?? "—"}
                        </span>
                      }
                    />
                  </div>
                )}
              </div>

              <Separator />

              {/* ── Billing details ─────────────────────────────────────── */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Billing Details
                </p>
                <div className="divide-y">
                  <DetailRow
                    label="Name"
                    value={charge.billingDetails?.name ?? "—"}
                  />
                  <DetailRow
                    label="Email"
                    value={
                      charge.billingDetails?.email ?? charge.receiptEmail ?? "—"
                    }
                  />
                  <DetailRow
                    label="Phone"
                    value={charge.billingDetails?.phone ?? "—"}
                  />
                  {charge.billingDetails?.address && (
                    <DetailRow
                      label="Address"
                      value={
                        [
                          charge.billingDetails.address.line1,
                          charge.billingDetails.address.line2,
                          charge.billingDetails.address.city,
                          charge.billingDetails.address.state,
                          charge.billingDetails.address.postalCode,
                          charge.billingDetails.address.country,
                        ]
                          .filter(Boolean)
                          .join(", ") || "—"
                      }
                    />
                  )}
                </div>
              </div>

              {/* ── Risk / Outcome ──────────────────────────────────────── */}
              {charge.outcome && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Risk &amp; Outcome
                    </p>
                    <div className="divide-y">
                      <DetailRow
                        label="Result"
                        value={charge.outcome.sellerMessage ?? "—"}
                      />
                      <DetailRow
                        label="Risk Level"
                        value={
                          <span className="capitalize">
                            {charge.outcome.riskLevel ?? "—"}
                          </span>
                        }
                      />
                      {charge.outcome.riskScore != null && (
                        <DetailRow
                          label="Risk Score"
                          value={String(charge.outcome.riskScore)}
                        />
                      )}
                      <DetailRow
                        label="Network Status"
                        value={charge.outcome.networkStatus ?? "—"}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* ── Failure info ────────────────────────────────────────── */}
              {(charge.failureCode || charge.failureMessage) && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Failure
                    </p>
                    <div className="divide-y">
                      <DetailRow
                        label="Code"
                        value={charge.failureCode ?? "—"}
                      />
                      <DetailRow
                        label="Message"
                        value={charge.failureMessage ?? "—"}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* ── IDs ─────────────────────────────────────────────────── */}
              <Separator />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  References
                </p>
                <div className="divide-y">
                  {charge.paymentIntent && (
                    <DetailRow
                      label="Payment Intent"
                      value={
                        <span className="font-mono text-xs">
                          {charge.paymentIntent}
                        </span>
                      }
                    />
                  )}
                  {charge.customer && (
                    <DetailRow
                      label="Customer"
                      value={
                        <span className="font-mono text-xs">
                          {charge.customer}
                        </span>
                      }
                    />
                  )}
                  {charge.balanceTransaction && (
                    <DetailRow
                      label="Balance Transaction"
                      value={
                        <span className="font-mono text-xs">
                          {charge.balanceTransaction}
                        </span>
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  );
}
