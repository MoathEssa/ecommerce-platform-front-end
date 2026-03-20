export type CartStatus = "Active" | "Abandoned" | "Ordered";

export interface AdminCartListItemDto {
  cartId: number;
  userId?: string;
  userEmail?: string;
  userName?: string;
  sessionId?: string;
  itemCount: number;
  subtotal: number;
  discountTotal: number;
  total: number;
  currencyCode: string;
  couponCode?: string;
  status: CartStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CartItemDto {
  id: number;
  variantId: number;
  productId: number;
  productTitle: string;
  productSlug: string;
  sku: string;
  options: Record<string, string>;
  imageUrl?: string;
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
  description?: string;
}

export interface CartDto {
  id: number;
  currencyCode: string;
  items: CartItemDto[];
  coupon?: CartCouponDto;
  subtotal: number;
  discountTotal: number;
  total: number;
  itemCount: number;
}
