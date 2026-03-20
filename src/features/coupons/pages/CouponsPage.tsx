import { useState, useCallback } from "react";
import { Plus, Search, SlidersHorizontal } from "lucide-react";

import { useAdminGetCouponsQuery } from "@features/coupons/api/couponsApi";
import type {
  CouponListItemDto,
  GetCouponsParams,
} from "@features/coupons/types";
import {
  CouponsTable,
  CouponFormDialog,
  CouponDetailSheet,
  CouponDeactivateDialog,
} from "@features/coupons/components";

import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/select";
import { useAdminGetCouponByIdQuery } from "@features/coupons/api/couponsApi";

// ── Pagination helper ─────────────────────────────────────────────────────────

function PaginationBar({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-1 pt-2">
      <p className="text-xs text-muted-foreground">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CouponsPage() {
  // ── Filter state ────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  const params: GetCouponsParams = {
    page,
    pageSize: PAGE_SIZE,
    search: search.trim() || undefined,
    isActive:
      isActiveFilter === "all" ? undefined : isActiveFilter === "active",
    sortBy,
  };

  const { data } = useAdminGetCouponsQuery(params);
  const totalPages = data?.totalPages ?? 1;

  // ── Dialog/Sheet state ──────────────────────────────────────────────────────
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editCouponId, setEditCouponId] = useState<number | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailCouponId, setDetailCouponId] = useState<number | null>(null);

  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [deactivateCoupon, setDeactivateCoupon] = useState<{
    id: number;
    code: string;
  } | null>(null);

  const { data: editCoupon } = useAdminGetCouponByIdQuery(editCouponId ?? 0, {
    skip: !editCouponId || formMode !== "edit",
  });

  // ── Handlers ────────────────────────────────────────────────────────────────
  function handleCreate() {
    setFormMode("create");
    setEditCouponId(null);
    setFormOpen(true);
  }

  const handleEdit = useCallback((coupon: CouponListItemDto) => {
    setFormMode("edit");
    setEditCouponId(coupon.id);
    setFormOpen(true);
  }, []);

  const handleViewDetail = useCallback((coupon: CouponListItemDto) => {
    setDetailCouponId(coupon.id);
    setDetailOpen(true);
  }, []);

  const handleDeactivate = useCallback((coupon: CouponListItemDto) => {
    setDeactivateCoupon({ id: coupon.id, code: coupon.code });
    setDeactivateOpen(true);
  }, []);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setPage(1);
  }

  function handleFilterChange(val: string) {
    setIsActiveFilter(val as "all" | "active" | "inactive");
    setPage(1);
  }

  function handleSortChange(val: string) {
    setSortBy(val);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Coupons</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create and manage discount coupons for your store.
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4" />
          Create Coupon
        </Button>
      </div>

      {/* ── Filters ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-50 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by code…"
            value={search}
            onChange={handleSearchChange}
            className="pl-8"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <Select value={isActiveFilter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="code-asc">Code A→Z</SelectItem>
            <SelectItem value="usedcount-desc">Most used</SelectItem>
            <SelectItem value="expiresat-asc">Expiring soon</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ── Table ───────────────────────────────────────────────────────────── */}
      <CouponsTable
        params={params}
        onViewDetail={handleViewDetail}
        onEdit={handleEdit}
        onDeactivate={handleDeactivate}
      />

      {/* ── Pagination ──────────────────────────────────────────────────────── */}
      <PaginationBar
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* ── Dialogs / Sheet ─────────────────────────────────────────────────── */}
      <CouponFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        coupon={formMode === "edit" ? (editCoupon ?? null) : null}
      />

      <CouponDetailSheet
        open={detailOpen}
        onOpenChange={setDetailOpen}
        couponId={detailCouponId}
      />

      <CouponDeactivateDialog
        open={deactivateOpen}
        onOpenChange={setDeactivateOpen}
        coupon={deactivateCoupon}
      />
    </div>
  );
}
