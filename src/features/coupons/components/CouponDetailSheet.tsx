import { useState } from "react";
import { format, parseISO } from "date-fns";
import {
  Tag,
  TrendingUp,
  Users,
  ReceiptText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  useAdminGetCouponByIdQuery,
  useAdminGetCouponUsagesQuery,
} from "@features/coupons/api/couponsApi";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@shared/ui/sheet";
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import { Separator } from "@shared/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/ui/tabs";
import { ScrollArea } from "@shared/ui/scroll-area";
import { Skeleton } from "@shared/ui/skeleton";

// ── Helpers ───────────────────────────────────────────────────────────────────

const SAR_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "SAR",
  minimumFractionDigits: 2,
});

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return format(parseISO(iso), "dd MMM yyyy, HH:mm");
}

function fmtMoney(n: number | null | undefined): string {
  if (n == null) return "—";
  return SAR_FORMATTER.format(n);
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
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

interface CouponDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  couponId: number | null;
}

// ── Usages sub-panel ──────────────────────────────────────────────────────────

function UsagesPanel({ couponId }: { couponId: number }) {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading } = useAdminGetCouponUsagesQuery({
    id: couponId,
    page,
    pageSize,
  });

  const usages = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  if (isLoading) {
    return (
      <div className="space-y-2 pt-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 rounded-md" />
        ))}
      </div>
    );
  }

  if (usages.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No usages yet for this coupon.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="rounded-md border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-3 py-2 font-medium text-xs text-muted-foreground">
                Order
              </th>
              <th className="text-left px-3 py-2 font-medium text-xs text-muted-foreground">
                Customer
              </th>
              <th className="text-right px-3 py-2 font-medium text-xs text-muted-foreground">
                Discount
              </th>
              <th className="text-right px-3 py-2 font-medium text-xs text-muted-foreground">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {usages.map((u) => (
              <tr
                key={u.orderId}
                className="hover:bg-muted/30 transition-colors"
              >
                <td className="px-3 py-2 font-mono text-xs font-medium">
                  {u.orderNumber}
                </td>
                <td className="px-3 py-2 text-xs text-muted-foreground">
                  {u.email ?? (u.userId ? `User #${u.userId}` : "Guest")}
                </td>
                <td className="px-3 py-2 text-right text-xs font-medium">
                  {fmtMoney(u.discountApplied)}
                </td>
                <td className="px-3 py-2 text-right text-xs text-muted-foreground whitespace-nowrap">
                  {fmtDate(u.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-muted-foreground">
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function CouponDetailSheet({
  open,
  onOpenChange,
  couponId,
}: CouponDetailSheetProps) {
  const { data: coupon, isLoading } = useAdminGetCouponByIdQuery(
    couponId ?? 0,
    { skip: !couponId },
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl flex flex-col gap-0 p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Coupon Details
          </SheetTitle>
        </SheetHeader>

        {isLoading || !coupon ? (
          <div className="flex-1 p-6 space-y-3">
            <Skeleton className="h-8 w-40 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <div className="px-6 py-4 space-y-5">
              {/* Code + status */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-2xl font-bold tracking-wide">
                    {coupon.code}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Created {fmtDate(coupon.createdAt)}
                    {coupon.updatedAt &&
                      ` · Updated ${fmtDate(coupon.updatedAt)}`}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    coupon.isActive
                      ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                      : "bg-muted text-muted-foreground"
                  }
                >
                  {coupon.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <Separator />

              {/* Core details */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Discount</p>
                  <p className="font-medium">
                    {coupon.discountType === "Percentage"
                      ? `${coupon.discountValue}%`
                      : fmtMoney(coupon.discountValue)}
                    <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                      (
                      {coupon.discountType === "Percentage"
                        ? "Percentage"
                        : "Fixed Amount"}
                      )
                    </span>
                  </p>
                </div>

                {coupon.maxDiscountAmount != null && (
                  <div>
                    <p className="text-xs text-muted-foreground">Max Cap</p>
                    <p className="font-medium">
                      {fmtMoney(coupon.maxDiscountAmount)}
                    </p>
                  </div>
                )}

                {coupon.minOrderAmount != null && (
                  <div>
                    <p className="text-xs text-muted-foreground">Min Order</p>
                    <p className="font-medium">
                      {fmtMoney(coupon.minOrderAmount)}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-muted-foreground">
                    Per-User Limit
                  </p>
                  <p className="font-medium">{coupon.perUserLimit}×</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Global Limit</p>
                  <p className="font-medium">
                    {coupon.usageLimit != null
                      ? `${coupon.usedCount} / ${coupon.usageLimit} used`
                      : `${coupon.usedCount} used (unlimited)`}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Valid From</p>
                  <p className="font-medium">
                    {coupon.startsAt ? fmtDate(coupon.startsAt) : "Immediately"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Expires</p>
                  <p className="font-medium">
                    {coupon.expiresAt ? fmtDate(coupon.expiresAt) : "Never"}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Tabs: Overview / Usages */}
              <Tabs defaultValue="overview">
                <TabsList className="w-full">
                  <TabsTrigger value="overview" className="flex-1">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="usages" className="flex-1">
                    Usage History
                  </TabsTrigger>
                </TabsList>

                {/* ── Overview ───────────────────────────────────────────── */}
                <TabsContent value="overview" className="mt-4 space-y-4">
                  {/* Usage stats */}
                  {coupon.usageStats && (
                    <div className="grid grid-cols-3 gap-2">
                      <StatCard
                        icon={ReceiptText}
                        label="Total Used"
                        value={coupon.usageStats.totalUsed}
                      />
                      <StatCard
                        icon={Users}
                        label="Unique Users"
                        value={coupon.usageStats.uniqueUsers}
                      />
                      <StatCard
                        icon={TrendingUp}
                        label="Discount Given"
                        value={fmtMoney(coupon.usageStats.totalDiscountGiven)}
                      />
                    </div>
                  )}

                  {/* Applicability */}
                  {coupon.applicableCategories.length > 0 && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1.5">
                        Restricted to Categories
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {coupon.applicableCategories.map((c) => (
                          <Badge
                            key={c.id}
                            variant="secondary"
                            className="text-xs"
                          >
                            {c.name || `#${c.id}`}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {coupon.applicableProducts.length > 0 && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1.5">
                        Restricted to Products
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {coupon.applicableProducts.map((p) => (
                          <Badge
                            key={p.id}
                            variant="secondary"
                            className="text-xs"
                          >
                            {p.title || `#${p.id}`}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {coupon.applicableVariants.length > 0 && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1.5">
                        Restricted to Variants
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {coupon.applicableVariants.map((v) => (
                          <Badge
                            key={v.id}
                            variant="outline"
                            className="text-xs font-mono"
                          >
                            {v.sku || `#${v.id}`}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {coupon.applicableCategories.length === 0 &&
                    coupon.applicableProducts.length === 0 &&
                    coupon.applicableVariants.length === 0 && (
                      <p className="text-xs text-muted-foreground">
                        Applies to all products globally.
                      </p>
                    )}
                </TabsContent>

                {/* ── Usage History ──────────────────────────────────────── */}
                <TabsContent value="usages" className="mt-4">
                  <UsagesPanel couponId={coupon.id} />
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  );
}
