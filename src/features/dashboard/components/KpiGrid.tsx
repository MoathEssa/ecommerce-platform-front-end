import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Clock,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "@shared/ui/card";
import type { KpiCardsDto } from "../types";

// ── Helpers ───────────────────────────────────────────────────────────────────

function pctChange(current: number, previous: number): number | null {
  if (previous === 0) return current > 0 ? 100 : null;
  return ((current - previous) / previous) * 100;
}

function formatCurrency(val: number): string {
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(1)}K`;
  return `$${val.toFixed(2)}`;
}

function formatNumber(val: number): string {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K`;
  return val.toLocaleString();
}

// ── KPI Card ──────────────────────────────────────────────────────────────────

interface KpiCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  change?: number | null;
  subtitle?: string;
  iconBg?: string;
}

function KpiCard({ title, value, icon: Icon, change, subtitle, iconBg }: KpiCardProps) {
  return (
    <Card className="gap-0 py-0">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {title}
            </p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {change != null && (
              <div className="flex items-center gap-1">
                {change >= 0 ? (
                  <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                )}
                <span
                  className={`text-xs font-medium ${change >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                >
                  {change >= 0 ? "+" : ""}
                  {change.toFixed(1)}%
                </span>
                <span className="text-xs text-muted-foreground">vs prev period</span>
              </div>
            )}
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div
            className={`rounded-lg p-2.5 ${iconBg ?? "bg-primary/10"}`}
          >
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Grid ──────────────────────────────────────────────────────────────────────

interface KpiGridProps {
  kpis: KpiCardsDto;
}

export default function KpiGrid({ kpis }: KpiGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        title="Revenue"
        value={formatCurrency(kpis.totalRevenue)}
        icon={DollarSign}
        change={pctChange(kpis.totalRevenue, kpis.prevPeriodRevenue)}
        iconBg="bg-emerald-500/10"
      />
      <KpiCard
        title="Orders"
        value={formatNumber(kpis.totalOrders)}
        icon={ShoppingCart}
        change={pctChange(kpis.totalOrders, kpis.prevPeriodOrders)}
        iconBg="bg-blue-500/10"
      />
      <KpiCard
        title="Customers"
        value={formatNumber(kpis.totalCustomers)}
        icon={Users}
        change={pctChange(kpis.totalCustomers, kpis.prevPeriodCustomers)}
        iconBg="bg-violet-500/10"
      />
      <KpiCard
        title="Avg. Order Value"
        value={formatCurrency(kpis.avgOrderValue)}
        icon={Package}
        change={pctChange(kpis.avgOrderValue, kpis.prevPeriodAvgOrderValue)}
        iconBg="bg-amber-500/10"
      />
      <KpiCard
        title="Active Products"
        value={formatNumber(kpis.activeProducts)}
        icon={Package}
        iconBg="bg-indigo-500/10"
      />
      <KpiCard
        title="Refunded"
        value={formatCurrency(kpis.totalRefunded)}
        icon={RefreshCw}
        iconBg="bg-red-500/10"
      />
      <KpiCard
        title="Pending Payment"
        value={formatNumber(kpis.pendingOrders)}
        icon={Clock}
        subtitle="Orders awaiting payment"
        iconBg="bg-orange-500/10"
      />
    </div>
  );
}
