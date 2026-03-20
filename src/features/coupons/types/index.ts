// ── Coupon list item (paged response) ────────────────────────────────────────

export interface CouponListItemDto {
  id: number;
  code: string;
  discountType: "Percentage" | "FixedAmount";
  discountValue: number;
  minOrderAmount: number | null;
  maxDiscountAmount: number | null;
  usageLimit: number | null;
  perUserLimit: number;
  usedCount: number;
  isActive: boolean;
  startsAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}

// ── Coupon applicability refs ─────────────────────────────────────────────────

export interface CouponCategoryRef {
  id: number;
  name: string;
}

export interface CouponProductRef {
  id: number;
  title: string;
}

export interface CouponVariantRef {
  id: number;
  sku: string;
}

// ── Coupon usage ──────────────────────────────────────────────────────────────

export interface CouponUsageItemDto {
  orderId: number;
  orderNumber: string;
  userId: number | null;
  email: string | null;
  discountApplied: number;
  createdAt: string;
}

export interface CouponUsageStatsDto {
  totalUsed: number;
  uniqueUsers: number;
  totalDiscountGiven: number;
  recentUsages: CouponUsageItemDto[];
}

// ── Coupon full detail ────────────────────────────────────────────────────────

export interface CouponDetailDto {
  id: number;
  code: string;
  discountType: "Percentage" | "FixedAmount";
  discountValue: number;
  minOrderAmount: number | null;
  maxDiscountAmount: number | null;
  usageLimit: number | null;
  perUserLimit: number;
  usedCount: number;
  isActive: boolean;
  startsAt: string | null;
  expiresAt: string | null;
  applicableCategories: CouponCategoryRef[];
  applicableProducts: CouponProductRef[];
  applicableVariants: CouponVariantRef[];
  usageStats: CouponUsageStatsDto | null;
  createdAt: string;
  updatedAt: string | null;
}

// ── Request bodies ────────────────────────────────────────────────────────────

export interface CreateCouponRequest {
  code: string;
  discountType: string;
  discountValue: number;
  minOrderAmount: number | null;
  maxDiscountAmount: number | null;
  usageLimit: number | null;
  perUserLimit: number;
  isActive: boolean;
  startsAt: string | null;
  expiresAt: string | null;
  applicableCategories: number[];
  applicableProducts: number[];
  applicableVariants: number[];
}

export type UpdateCouponRequest = CreateCouponRequest;

// ── Query params ──────────────────────────────────────────────────────────────

export interface GetCouponsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: string;
}
