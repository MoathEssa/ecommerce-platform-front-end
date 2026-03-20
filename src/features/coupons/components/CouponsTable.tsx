import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, PowerOff } from "lucide-react";
import { format, parseISO } from "date-fns";

import { useAdminGetCouponsQuery } from "@features/coupons/api/couponsApi";
import type {
  CouponListItemDto,
  GetCouponsParams,
} from "@features/coupons/types";

import { DataTableV2 } from "@shared/components/data-table-v2";
import { Button } from "@shared/ui/button";
import { Badge } from "@shared/ui/badge";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDiscount(row: CouponListItemDto): string {
  if (row.discountType === "Percentage") return `${row.discountValue}%`;
  return `$${row.discountValue.toFixed(2)}`;
}

function couponStatus(
  row: CouponListItemDto,
): "active" | "inactive" | "expired" | "scheduled" {
  if (!row.isActive) return "inactive";
  const now = new Date();
  if (row.expiresAt && parseISO(row.expiresAt) < now) return "expired";
  if (row.startsAt && parseISO(row.startsAt) > now) return "scheduled";
  return "active";
}

function StatusBadge({ row }: { row: CouponListItemDto }) {
  const status = couponStatus(row);
  const map = {
    active:
      "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    inactive: "bg-muted text-muted-foreground",
    expired: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    scheduled:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  } as const;
  return (
    <Badge
      variant="outline"
      className={`font-normal capitalize text-xs ${map[status]}`}
    >
      {status}
    </Badge>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface CouponsTableProps {
  params: GetCouponsParams;
  onViewDetail: (coupon: CouponListItemDto) => void;
  onEdit: (coupon: CouponListItemDto) => void;
  onDeactivate: (coupon: CouponListItemDto) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CouponsTable({
  params,
  onViewDetail,
  onEdit,
  onDeactivate,
}: CouponsTableProps) {
  const { data, isLoading } = useAdminGetCouponsQuery(params);
  const rows: CouponListItemDto[] = data?.items ?? [];

  const columns: ColumnDef<CouponListItemDto>[] = useMemo(
    () => [
      {
        accessorKey: "code",
        header: "Code",
        meta: { label: "Code", filterable: true, sortable: true },
        cell: ({ row }) => (
          <span className="font-mono font-semibold text-sm tracking-wide">
            {row.original.code}
          </span>
        ),
      },
      {
        id: "discount",
        header: "Discount",
        enableSorting: false,
        meta: { label: "Discount" },
        cell: ({ row }) => (
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-sm">
              {formatDiscount(row.original)}
            </span>
            <span className="text-xs text-muted-foreground">
              {row.original.discountType === "Percentage"
                ? "Percentage"
                : "Fixed Amount"}
            </span>
          </div>
        ),
      },
      {
        id: "usage",
        header: "Usage",
        enableSorting: false,
        meta: { label: "Usage" },
        cell: ({ row }) => {
          const { usedCount, usageLimit } = row.original;
          return (
            <span className="text-sm text-muted-foreground">
              {usedCount}
              {usageLimit != null ? ` / ${usageLimit}` : ""}
            </span>
          );
        },
      },
      {
        id: "validity",
        header: "Validity",
        enableSorting: false,
        meta: { label: "Validity" },
        cell: ({ row }) => {
          const { startsAt, expiresAt } = row.original;
          if (!startsAt && !expiresAt)
            return (
              <span className="text-xs text-muted-foreground">No limit</span>
            );
          const fmt = (d: string) => format(parseISO(d), "dd MMM yyyy");
          return (
            <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
              {startsAt && <span>From: {fmt(startsAt)}</span>}
              {expiresAt && <span>Until: {fmt(expiresAt)}</span>}
            </div>
          );
        },
      },
      {
        id: "status",
        header: "Status",
        enableSorting: false,
        meta: { label: "Status" },
        cell: ({ row }) => <StatusBadge row={row.original} />,
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        enableColumnFilter: false,
        enableHiding: false,
        cell: ({ row }) => {
          const coupon = row.original;
          return (
            <div className="flex items-center justify-end gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onViewDetail(coupon)}
                title="View details"
              >
                <Eye className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onEdit(coupon)}
                title="Edit"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              {coupon.isActive && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => onDeactivate(coupon)}
                  title="Deactivate"
                >
                  <PowerOff className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [onViewDetail, onEdit, onDeactivate],
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
          No coupons found.
        </div>
      }
    />
  );
}
