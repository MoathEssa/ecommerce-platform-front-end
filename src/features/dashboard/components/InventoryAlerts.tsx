import { AlertTriangle, PackageX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import type { InventoryAlertDto } from "../types";

interface InventoryAlertsProps {
  alert: InventoryAlertDto;
}

export default function InventoryAlerts({ alert }: InventoryAlertsProps) {
  const hasIssues = alert.lowStockCount > 0 || alert.outOfStockCount > 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          Inventory Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasIssues ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            All inventory levels are healthy.
          </p>
        ) : (
          <div className="space-y-4">
            {/* Summary chips */}
            <div className="flex gap-3">
              {alert.lowStockCount > 0 && (
                <div className="flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2 dark:border-yellow-800 dark:bg-yellow-900/20">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                    {alert.lowStockCount} Low Stock
                  </span>
                </div>
              )}
              {alert.outOfStockCount > 0 && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 dark:border-red-800 dark:bg-red-900/20">
                  <PackageX className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <span className="text-sm font-medium text-red-800 dark:text-red-300">
                    {alert.outOfStockCount} Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Low stock items list */}
            {alert.lowStockItems.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Low Stock Items
                </p>
                <div className="divide-y rounded-lg border">
                  {alert.lowStockItems.map((item) => (
                    <div
                      key={item.variantId}
                      className="flex items-center justify-between px-3 py-2"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">
                          {item.productTitle}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          SKU: {item.sku}
                        </p>
                      </div>
                      <span
                        className={`ml-3 text-sm font-semibold ${
                          item.available === 0
                            ? "text-red-600 dark:text-red-400"
                            : "text-yellow-600 dark:text-yellow-400"
                        }`}
                      >
                        {item.available} left
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
