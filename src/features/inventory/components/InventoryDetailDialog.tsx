import {
  ArrowDownCircle,
  ArrowUpCircle,
  Clock,
  Package,
  SlidersHorizontal,
} from "lucide-react";

import { useGetInventoryDetailQuery } from "../api/inventoryApi";
import StockStatusBadge from "./StockStatusBadge";
import type { InventoryListItemDto } from "../types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@shared/ui/dialog";
import { Skeleton } from "@shared/ui/skeleton";
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import { Separator } from "@shared/ui/separator";
import { cn } from "@shared/lib/utils";

interface Props {
  item: InventoryListItemDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdjust: () => void;
}

function parseOptions(optionsJson?: string): Record<string, string> {
  if (!optionsJson) return {};
  try {
    return JSON.parse(optionsJson) as Record<string, string>;
  } catch {
    return {};
  }
}

export default function InventoryDetailDialog({
  item,
  open,
  onOpenChange,
  onAdjust,
}: Props) {
  const { data, isLoading } = useGetInventoryDetailQuery(item?.variantId ?? 0, {
    skip: !open || !item,
  });

  const derivedStatus =
    data?.available === 0
      ? "outOfStock"
      : data?.available != null && data.available <= 5
        ? "lowStock"
        : "inStock";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-muted-foreground" />
            Inventory Details
          </DialogTitle>
        </DialogHeader>

        {isLoading || !data ? (
          <div className="space-y-3 py-2">
            <Skeleton className="h-16 w-full rounded-xl" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
            </div>
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* ── Product info ────────────────────────────────── */}
            <div className="rounded-xl border bg-muted/30 p-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-sm leading-snug line-clamp-2">
                    {data.productTitle}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground mt-0.5">
                    SKU: {data.sku}
                  </p>
                </div>
                <StockStatusBadge status={derivedStatus} />
              </div>

              {item?.options &&
                Object.keys(parseOptions(item.options)).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {Object.entries(parseOptions(item.options)).map(
                      ([k, v]) => (
                        <Badge key={k} variant="secondary" className="text-xs">
                          {k}: {v}
                        </Badge>
                      ),
                    )}
                  </div>
                )}

              {item?.updatedAt && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1.5 border-t">
                  <Clock className="h-3 w-3 shrink-0" />
                  Last synced:{" "}
                  <span className="font-medium text-foreground">
                    {new Date(item.updatedAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* ── Stock counters ───────────────────────────────── */}
            <div className="grid grid-cols-2 gap-3">
              <div className="overflow-hidden rounded-xl border bg-card p-4 text-center space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  On Hand
                </p>
                <p className="text-3xl font-bold tabular-nums truncate">
                  {data.onHand.toLocaleString()}
                </p>
              </div>
              <div className="overflow-hidden rounded-xl border bg-card p-4 text-center space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Available
                </p>
                <p
                  className={cn(
                    "text-3xl font-bold tabular-nums truncate",
                    data.available === 0
                      ? "text-red-600 dark:text-red-400"
                      : data.available <= 5
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-green-600 dark:text-green-400",
                  )}
                >
                  {data.available.toLocaleString()}
                </p>
              </div>
            </div>

            {/* ── Adjustments ─────────────────────────────────── */}
            <div className="rounded-xl border overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 border-b">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                  Adjustments
                </div>
                <Badge variant="secondary" className="text-xs tabular-nums">
                  {data.adjustments.length}
                </Badge>
              </div>

              {data.adjustments.length === 0 ? (
                <p className="text-sm text-center text-muted-foreground py-8">
                  No adjustments recorded yet.
                </p>
              ) : (
                <div className="divide-y max-h-52 overflow-y-auto">
                  {data.adjustments.map((adj) => (
                    <div
                      key={adj.id}
                      className="flex items-center justify-between px-4 py-2.5 text-sm"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {adj.delta > 0 ? (
                          <ArrowUpCircle className="h-4 w-4 text-green-500 shrink-0" />
                        ) : (
                          <ArrowDownCircle className="h-4 w-4 text-red-500 shrink-0" />
                        )}
                        <span
                          className={cn(
                            "font-semibold tabular-nums shrink-0",
                            adj.delta > 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400",
                          )}
                        >
                          {adj.delta > 0 ? `+${adj.delta}` : adj.delta}
                        </span>
                        {adj.reason && (
                          <span className="text-muted-foreground truncate">
                            {adj.reason}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-4 shrink-0">
                        {new Date(adj.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Footer ──────────────────────────────────────── */}
            <Separator />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button onClick={onAdjust}>Adjust Stock</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
