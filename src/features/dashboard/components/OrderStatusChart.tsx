import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import type { OrderStatusBreakdownDto } from "../types";

interface OrderStatusChartProps {
  data: OrderStatusBreakdownDto[];
}

const STATUS_COLORS: Record<string, string> = {
  PendingPayment: "#f59e0b",
  Paid: "#10b981",
  Processing: "#3b82f6",
  Shipped: "#6366f1",
  Delivered: "#22c55e",
  Canceled: "#ef4444",
  PartiallyRefunded: "#f97316",
  Refunded: "#dc2626",
};

const STATUS_LABELS: Record<string, string> = {
  PendingPayment: "Pending",
  Paid: "Paid",
  Processing: "Processing",
  Shipped: "Shipped",
  Delivered: "Delivered",
  Canceled: "Canceled",
  PartiallyRefunded: "Partial Refund",
  Refunded: "Refunded",
};

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: OrderStatusBreakdownDto & { fill: string } }>;
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="rounded-lg border bg-card px-3 py-2 shadow-lg">
      <p className="text-sm font-medium">
        {STATUS_LABELS[item.status] ?? item.status}
      </p>
      <p className="text-xs text-muted-foreground">{item.count} orders</p>
    </div>
  );
}

export default function OrderStatusChart({ data }: OrderStatusChartProps) {
  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Order Status</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[280px] items-center justify-center">
            <p className="text-sm text-muted-foreground">No orders.</p>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={220}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="count"
                  nameKey="status"
                  stroke="none"
                >
                  {data.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={STATUS_COLORS[entry.status] ?? "#94a3b8"}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <text
                  x="50%"
                  y="48%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-foreground text-2xl font-bold"
                >
                  {total}
                </text>
                <text
                  x="50%"
                  y="58%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-muted-foreground text-[11px]"
                >
                  orders
                </text>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2">
              {data.map((entry) => (
                <div key={entry.status} className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{
                      backgroundColor:
                        STATUS_COLORS[entry.status] ?? "#94a3b8",
                    }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {STATUS_LABELS[entry.status] ?? entry.status}
                  </span>
                  <span className="text-xs font-semibold ml-auto">
                    {entry.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
