import { useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@shared/ui/tabs";
import { Button } from "@shared/ui/button";
import { Skeleton } from "@shared/ui/skeleton";
import { Card } from "@shared/ui/card";
import { useGetDashboardSummaryQuery } from "../api/dashboardApi";
import {
  KpiGrid,
  RevenueChart,
  OrderStatusChart,
  TopProductsList,
  RecentOrdersTable,
  InventoryAlerts,
} from "../components";

const PERIOD_OPTIONS = [
  { label: "7d", value: 7 },
  { label: "30d", value: 30 },
  { label: "90d", value: 90 },
] as const;

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* KPI skeletons */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <Card key={i} className="p-5">
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-3 w-16" />
          </Card>
        ))}
      </div>
      {/* Chart skeletons */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6">
          <Skeleton className="h-[300px] w-full rounded" />
        </Card>
        <Card className="p-6">
          <Skeleton className="h-[300px] w-full rounded" />
        </Card>
      </div>
      {/* Table skeletons */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6">
          <Skeleton className="h-[240px] w-full rounded" />
        </Card>
        <Card className="p-6">
          <Skeleton className="h-[240px] w-full rounded" />
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [days, setDays] = useState(30);
  const { data, isLoading, isFetching, isError, refetch } =
    useGetDashboardSummaryQuery({ days });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Your store at a glance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Tabs value={String(days)} onValueChange={(v) => setDays(Number(v))}>
            <TabsList>
              {PERIOD_OPTIONS.map((opt) => (
                <TabsTrigger key={opt.value} value={String(opt.value)}>
                  {opt.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <DashboardSkeleton />
      ) : isError || !data ? (
        <Card className="flex flex-col items-center justify-center gap-3 py-16">
          <p className="text-sm text-muted-foreground">
            Failed to load dashboard data.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* KPI Cards */}
          <KpiGrid kpis={data.kpis} />

          {/* Charts Row */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RevenueChart data={data.revenueChart} />
            </div>
            <OrderStatusChart data={data.orderStatusBreakdown} />
          </div>

          {/* Tables + Alerts Row */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RecentOrdersTable orders={data.recentOrders} />
            </div>
            <div className="space-y-6">
              <TopProductsList products={data.topProducts} />
              <InventoryAlerts alert={data.inventoryAlert} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
