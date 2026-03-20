// ── Category ──────────────────────────────────────────────────────────────────

export interface CategoryTreeDto {
  id: number;
  name: string;
  slug: string;
  imageUrl: string | null;
  sortOrder: number;
  children: CategoryTreeDto[];
}

export interface BreadcrumbDto {
  name: string;
  slug: string;
}

export interface CategoryChildDto {
  id: number;
  name: string;
  slug: string;
  imageUrl: string | null;
}

export interface CategoryDetailDto {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  breadcrumbs: BreadcrumbDto[];
  children: CategoryChildDto[];
}

// ── Product List ─────────────────────────────────────────────────────────────

export interface ProductListCategoryDto {
  name: string;
  slug: string;
}

export interface ProductListItemDto {
  id: number;
  title: string;
  slug: string;
  brand: string | null;
  primaryImageUrl: string | null;
  minPrice: number;
  maxPrice: number;
  currencyCode: string;
  inStock: boolean;
  primaryCategory: ProductListCategoryDto | null;
}

// ── Product Detail ───────────────────────────────────────────────────────────

export interface ProductCategoryDto {
  id: number;
  name: string;
  slug: string;
}

export interface ProductVariantDto {
  id: number;
  sku: string;
  options: Record<string, string>;
  basePrice: number;
  currencyCode: string;
  stockStatus: string;
  variantName: string | null;
  variantImage: string | null;
}

export interface ProductImageDto {
  id: number;
  url: string;
  variantId: number | null;
  sortOrder: number;
}

export interface ProductDetailDto {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  descriptionHtml: string | null;
  brand: string | null;
  status: string;
  weightGrams: number | null;
  material: string | null;
  breadcrumbs: BreadcrumbDto[];
  category: ProductCategoryDto | null;
  variants: ProductVariantDto[];
  images: ProductImageDto[];
  createdAt: string;
}

// ── Search ───────────────────────────────────────────────────────────────────

export interface SearchSuggestionDto {
  type: string;
  title: string;
  slug: string;
}
// ── Reviews ─────────────────────────────────────────────────────────────────────────────────

export interface ReviewDto {
  commentId: number;
  commentUser: string | null;
  score: number;
  comment: string;
  commentDate: string | null;
  countryCode: string | null;
  flagIconUrl: string | null;
  commentUrls: string[];
}

export interface ReviewListDto {
  pageNum: number;
  pageSize: number;
  total: number;
  averageScore: number;
  items: ReviewDto[];
}
// ── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItemDto {
  id: number;
  variantId: number;
  productId: number;
  productTitle: string;
  productSlug: string;
  sku: string;
  options: Record<string, string>;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  stockStatus: string;
  warnings: string[];
}

export interface CartCouponDto {
  code: string;
  discountType: string;
  discountAmount: number;
  description: string | null;
}

export interface CartDto {
  id: number;
  currencyCode: string;
  items: CartItemDto[];
  coupon: CartCouponDto | null;
  subtotal: number;
  discountTotal: number;
  total: number;
  itemCount: number;
}

// ── Checkout ─────────────────────────────────────────────────────────────────

export interface CheckoutAddress {
  fullName: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  region?: string;
  postalCode?: string;
  country: string;
}

export interface CheckoutItem {
  variantId: number;
  quantity: number;
}

export interface PlaceOrderRequest {
  email?: string;
  items: CheckoutItem[];
  shippingAddress: CheckoutAddress;
  billingAddress?: CheckoutAddress;
  couponCode?: string;
}

export interface PlaceOrderPaymentDto {
  provider: string;
  clientSecret: string;
  intentId: string;
}

export interface PlaceOrderSummaryDto {
  itemCount: number;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  shippingTotal: number;
  total: number;
}

export interface PlaceOrderResponse {
  orderId: number;
  orderNumber: string;
  total: number;
  currencyCode: string;
  status: string;
  payment: PlaceOrderPaymentDto;
  summary: PlaceOrderSummaryDto;
}

// ── Freight / Shipping ────────────────────────────────────────────────────────

export interface FreightItemBody {
  variantId: number;
  quantity: number;
}

export interface CalculateFreightRequest {
  items: FreightItemBody[];
  endCountryCode: string;
  zip?: string;
}

export interface FreightOptionDto {
  logisticName: string;
  /** Shipping cost in USD */
  logisticPrice: number;
  /** Estimated delivery window, e.g. "2-5" (days) */
  logisticAging: string;
  taxesFee: number | null;
  clearanceOperationFee: number | null;
  totalPostageFee: number | null;
}

// ── Filters ──────────────────────────────────────────────────────────────────

export interface ProductFilters {
  page?: number;
  pageSize?: number;
  categorySlug?: string;
  search?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  inStock?: boolean;
}
