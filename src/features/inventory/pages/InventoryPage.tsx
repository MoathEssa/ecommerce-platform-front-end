import { useState } from "react";
import { Warehouse, RefreshCw, Clock } from "lucide-react";

import InventoryTable from "../components/InventoryTable";
import InventoryDetailDialog from "../components/InventoryDetailDialog";
import AdjustmentDialog from "../components/AdjustmentDialog";
import type { InventoryListItemDto } from "../types";

import { Button } from "@shared/ui/button";

export default function InventoryPage() {
  const [detailItem, setDetailItem] = useState<InventoryListItemDto | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [adjustItem, setAdjustItem] = useState<InventoryListItemDto | null>(null);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  function openDetail(item: InventoryListItemDto) {
    setDetailItem(item);
    setDetailOpen(true);
  }

  function openAdjust(item: InventoryListItemDto) {
    setAdjustItem(item);
    setAdjustOpen(true);
  }

  function handleDetailAdjust() {
    setDetailOpen(false);
    if (detailItem) {
      setAdjustItem(detailItem);
      setAdjustOpen(true);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Warehouse className="h-6 w-6" />
            Inventory
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor stock levels and manage adjustments across all product variants.
          </p>
          {lastSynced && (
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              Most recently synced by worker:{" "}
              <span className="font-medium text-foreground">
                {new Date(lastSynced).toLocaleString()}
              </span>
            </div>
          )}
        </div>
        <Button
          variant="outline"
          onClick={() => setRefreshKey((k) => k + 1)}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Table */}
      <InventoryTable
        key={refreshKey}
        onViewDetails={openDetail}
        onCreateAdjustment={openAdjust}
        onLastUpdated={setLastSynced}
      />

      {/* Detail Dialog */}
      <InventoryDetailDialog
        item={detailItem}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onAdjust={handleDetailAdjust}
      />

      {/* Adjustment Dialog */}
      <AdjustmentDialog
        item={adjustItem}
        open={adjustOpen}
        onOpenChange={setAdjustOpen}
      />
    </div>
  );
}
