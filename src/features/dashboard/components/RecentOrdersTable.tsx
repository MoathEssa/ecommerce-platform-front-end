import { ClipboardList } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Badge } from "@shared/ui/badge";
import type { RecentOrderDto } from "../types";

const STATUS_STYLE: Record<string, string> = {
  Pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Processing:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Shipped:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  Delivered:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  Cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  Refunded:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  PartiallyRefunded:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
};

interface RecentOrdersTableProps {
  orders: RecentOrderDto[];
}

export default function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <ClipboardList className="h-4 w-4 text-blue-500" />
          Recent Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No orders yet.
          </p>
        ) : (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="px-6 py-2 font-medium">Order</th>
                  <th className="px-6 py-2 font-medium">Customer</th>
                  <th className="px-6 py-2 font-medium">Status</th>
                  <th className="px-6 py-2 font-medium text-right">Total</th>
                  <th className="px-6 py-2 font-medium text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b last:border-0 transition-colors hover:bg-muted/50"
                  >
                    <td className="px-6 py-2.5 font-medium">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-2.5 text-muted-foreground truncate max-w-[180px]">
                      {order.email}
                    </td>
                    <td className="px-6 py-2.5">
                      <Badge
                        variant="secondary"
                        className={`text-[11px] font-medium ${STATUS_STYLE[order.status] ?? ""}`}
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-2.5 text-right font-medium">
                      {order.currencyCode === "USD" ? "$" : order.currencyCode}{" "}
                      {order.total.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-6 py-2.5 text-right text-muted-foreground">
                      {format(new Date(order.createdAt), "MMM d, yyyy")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
