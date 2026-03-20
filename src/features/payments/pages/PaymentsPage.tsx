import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useAdminGetChargesQuery } from "@features/payments/api/paymentsApi";
import type { StripeChargeDto } from "@features/payments/types";
import { ChargesTable, ChargeDetailSheet } from "@features/payments/components";

import { Button } from "@shared/ui/button";

// ── Cursor-based pagination ───────────────────────────────────────────────────

const PAGE_SIZE = 20;

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PaymentsPage() {
  // Cursor stack: index 0 = first page (no cursor), each entry is the lastId
  // of the previous page's response that yields the next page.
  const [cursorStack, setCursorStack] = useState<(string | undefined)[]>([
    undefined,
  ]);
  const currentCursorIndex = cursorStack.length - 1;
  const currentCursor = cursorStack[currentCursorIndex];

  const { data, isLoading } = useAdminGetChargesQuery({
    limit: PAGE_SIZE,
    startingAfter: currentCursor,
  });

  // ── Detail sheet state ──────────────────────────────────────────────────────
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedChargeId, setSelectedChargeId] = useState<string | null>(null);

  const handleViewDetail = useCallback((charge: StripeChargeDto) => {
    setSelectedChargeId(charge.id);
    setDetailOpen(true);
  }, []);

  // ── Pagination ──────────────────────────────────────────────────────────────
  function handleNext() {
    if (data?.lastId) {
      setCursorStack((prev) => [...prev, data.lastId ?? undefined]);
    }
  }

  function handlePrev() {
    if (cursorStack.length > 1) {
      setCursorStack((prev) => prev.slice(0, -1));
    }
  }

  const pageNumber = cursorStack.length;
  const hasPrev = cursorStack.length > 1;
  const hasNext = !isLoading && !!data?.hasMore;

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-semibold">Payments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          All Stripe charges processed through your account.
        </p>
      </div>

      {/* ── Table ───────────────────────────────────────────────────────────── */}
      <ChargesTable
        params={{ limit: PAGE_SIZE, startingAfter: currentCursor }}
        onViewDetail={handleViewDetail}
      />

      {/* ── Pagination ──────────────────────────────────────────────────────── */}
      {(hasPrev || hasNext) && (
        <div className="flex items-center justify-between px-1 pt-2">
          <p className="text-xs text-muted-foreground">Page {pageNumber}</p>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={!hasPrev}
              onClick={handlePrev}
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasNext}
              onClick={handleNext}
            >
              Next
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Detail sheet ────────────────────────────────────────────────────── */}
      <ChargeDetailSheet
        open={detailOpen}
        onOpenChange={setDetailOpen}
        chargeId={selectedChargeId}
      />
    </div>
  );
}
