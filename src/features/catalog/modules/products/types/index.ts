// ── Status ────────────────────────────────────────────────────────────────────
// Matches the backend ProductStatus enum: Draft=1, Active=2, Archived=3
export type ProductStatus = 1 | 2 | 3;

// ── Inventory ─────────────────────────────────────────────────────────────────

export interface AdminInventoryDto {
  onHand: number;
  available: number;
}

// ── Variant ───────────────────────────────────────────────────────────────────

export interface AdminProductVariantDto {
  id: number;
  sku: string;
  options: Record<string, string>;
  basePrice: number;
  currencyCode: string;
  isActive: boolean;
  inventory: AdminInventoryDto;
}

// ── Image ─────────────────────────────────────────────────────────────────────

export interface ProductImageDto {
  id: number;
  url: string;
  variantId?: number | null;
  sortOrder: number;
}

// ── Category ──────────────────────────────────────────────────────────────────
interface ProductCategoryDto {
  id: number;
  name: string;
  slug: string;
}

// ── List item ─────────────────────────────────────────────────────────────────

export interface AdminProductListItemDto {
  id: number;
  title: string;
  slug: string;
  brand?: string | null;
  status: ProductStatus;
  activeVariantCount: number;
  primaryImageUrl?: string | null;
  createdAt: string;
}

// ── Full detail ───────────────────────────────────────────────────────────────

export interface AdminProductDetailDto {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  descriptionHtml?: string | null;
  brand?: string | null;
  status: ProductStatus;
  weightGrams?: number | null;
  material?: string | null;
  category?: ProductCategoryDto | null;
  variants: AdminProductVariantDto[];
  images: ProductImageDto[];
  createdAt: string;
  updatedAt?: string | null;
}

// ── Request bodies ────────────────────────────────────────────────────────────

export interface CreateProductRequest {
  title: string;
  slug?: string | null;
  description?: string | null;
  brand?: string | null;
}

export interface UpdateProductRequest {
  title: string;
  slug?: string | null;
  description?: string | null;
  brand?: string | null;
}

export interface ChangeProductStatusRequest {
  status: ProductStatus;
}

export interface BulkChangeProductStatusRequest {
  ids: number[];
  status: ProductStatus;
}

export type { ProductCategoryDto };

export interface SetProductCategoryRequest {
  categoryId: number | null;
}

export interface AddVariantRequest {
  options: Record<string, string>;
  basePrice: number;
  currencyCode: string;
  isActive: boolean;
  initialStock: number;
}

export interface UpdateVariantRequest {
  sku: string;
  options: Record<string, string>;
  basePrice: number;
  currencyCode: string;
  isActive: boolean;
}
