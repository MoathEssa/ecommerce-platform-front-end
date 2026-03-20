import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { format, parseISO } from "date-fns";

import { useAdminGetChargesQuery } from "@features/payments/api/paymentsApi";
import type {
  GetChargesParams,
  StripeChargeDto,
} from "@features/payments/types";

import { DataTableV2 } from "@shared/components/data-table-v2";
import { Button } from "@shared/ui/button";
import { Badge } from "@shared/ui/badge";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Format Stripe amount (smallest unit) to display string, e.g. 1099 + "usd" → "$10.99" */
function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amount / 100);
}

function ChargeStatusBadge({ status }: { status: StripeChargeDto["status"] }) {
  const map: Record<StripeChargeDto["status"], string> = {
    succeeded:
      "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    pending:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
    failed: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  };
  return (
    <Badge
      variant="outline"
      className={`font-normal capitalize text-xs ${map[status]}`}
    >
      {status}
    </Badge>
  );
}

function CardBadge({ charge }: { charge: StripeChargeDto }) {
  const card = charge.paymentMethodDetails?.card;
  if (!card) return <span className="text-xs text-muted-foreground">—</span>;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-sm font-medium capitalize">
        {card.brand ?? "Card"}
      </span>
      <span className="text-xs text-muted-foreground">
        •••• {card.last4} &middot; {card.expMonth}/{card.expYear}
      </span>
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface ChargesTableProps {
  params: GetChargesParams;
  onViewDetail: (charge: StripeChargeDto) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ChargesTable({
  params,
  onViewDetail,
}: ChargesTableProps) {
  const { data, isLoading } = useAdminGetChargesQuery(params);
  const rows: StripeChargeDto[] = data?.data ?? [];

  const columns: ColumnDef<StripeChargeDto>[] = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Charge ID",
        meta: { label: "Charge ID", filterable: true },
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground">
            {row.original.id}
          </span>
        ),
      },
      {
        id: "amount",
        header: "Amount",
        enableSorting: false,
        meta: { label: "Amount" },
        cell: ({ row }) => {
          const { amount, amountRefunded, currency } = row.original;
          return (
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold">
                {formatAmount(amount, currency)}
              </span>
              {amountRefunded > 0 && (
                <span className="text-xs text-muted-foreground">
                  Refunded: {formatAmount(amountRefunded, currency)}
                </span>
              )}
            </div>
          );
        },
      },
      {
        id: "card",
        header: "Payment Method",
        enableSorting: false,
        meta: { label: "Payment Method" },
        cell: ({ row }) => <CardBadge charge={row.original} />,
      },
      {
        id: "customer",
        header: "Customer",
        enableSorting: false,
        meta: { label: "Customer" },
        cell: ({ row }) => {
          const { billingDetails, receiptEmail } = row.original;
          const name = billingDetails?.name;
          const email = billingDetails?.email ?? receiptEmail;
          if (!name && !email)
            return <span className="text-xs text-muted-foreground">—</span>;
          return (
            <div className="flex flex-col gap-0.5">
              {name && <span className="text-sm">{name}</span>}
              {email && (
                <span className="text-xs text-muted-foreground">{email}</span>
              )}
            </div>
          );
        },
      },
      {
        id: "created",
        header: "Date",
        enableSorting: false,
        meta: { label: "Date" },
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {format(parseISO(row.original.created), "dd MMM yyyy, HH:mm")}
          </span>
        ),
      },
      {
        id: "status",
        header: "Status",
        enableSorting: false,
        meta: { label: "Status" },
        cell: ({ row }) => <ChargeStatusBadge status={row.original.status} />,
      },
      {
        id: "flags",
        header: "Flags",
        enableSorting: false,
        meta: { label: "Flags" },
        cell: ({ row }) => {
          const { disputed, refunded } = row.original;
          return (
            <div className="flex gap-1 flex-wrap">
              {disputed && (
                <Badge
                  variant="outline"
                  className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
                >
                  Disputed
                </Badge>
              )}
              {refunded && (
                <Badge
                  variant="outline"
                  className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                >
                  Refunded
                </Badge>
              )}
              {!disputed && !refunded && (
                <span className="text-xs text-muted-foreground">—</span>
              )}
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        enableColumnFilter: false,
        enableHiding: false,
        cell: ({ row }) => (
          <div className="flex items-center justify-end">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onViewDetail(row.original)}
              title="View details"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
          </div>
        ),
      },
    ],
    [onViewDetail],
  );

  return (
    <DataTableV2
      data={rows}
      columns={columns}
      isLoading={isLoading}
      showToolbar={false}
      showPagination={false}
      emptyState={
        <div className="py-12 text-center text-sm text-muted-foreground">
          No charges found.
        </div>
      }
    />
  );
}
