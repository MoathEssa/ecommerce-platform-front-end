// ── CJ Category DTOs ──────────────────────────────────────────────────────────

/** A node in the CJ 3-level category hierarchy.
 *  Level 1 & 2 are group headings (categoryId === null).
 *  Only Level 3 has a non-null categoryId (UUID). */
export interface CjCategoryNodeDto {
  categoryId: string | null;
  name: string;
  level: 1 | 2 | 3;
  children: CjCategoryNodeDto[];
  /** True when this CJ category has already been imported into the store. */
  isImported: boolean;
}

/** Flattened row for the categories table (derived from the tree). */
export interface CjCategoryFlatRow {
  categoryId: string | null;
  name: string;
  level: 1 | 2 | 3;
  level1Name: string;
  level2Name: string | null;
}

// ── CJ Product DTOs ──────────────────────────────────────────────────────────

export interface CjProductListItemDto {
  id: string;
  nameEn: string;
  sku: string | null;
  bigImage: string | null;
  sellPrice: string | null;
  discountPrice: string | null;
  discountPriceRate: string | null;
  listedNum: number | null;
  categoryId: string | null;
  threeCategoryName: string | null;
  twoCategoryName: string | null;
  oneCategoryName: string | null;
  freeShipping: boolean;
  productType: string | null;
  supplierName: string | null;
  createAt: number | null;
  warehouseInventoryNum: number | null;
  deliveryCycle: string | null;
}

export interface CjProductListResult {
  items: CjProductListItemDto[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

export interface CjProductSearchParams {
  keyWord?: string;
  page?: number;
  size?: number;
  categoryId?: string;
  countryCode?: string;
  startSellPrice?: number;
  endSellPrice?: number;
  addMarkStatus?: number;
  productType?: number;
  sort?: string;
  orderBy?: number;
}

// ── CJ Product Variant ────────────────────────────────────────────────────────

export interface CjProductVariantDto {
  vid: string;
  pid: string;
  variantNameEn: string | null;
  variantImage: string | null;
  variantSku: string | null;
  variantKey: string | null;
  variantStandard: string | null;
  variantSellPrice: number | null;
  variantSugSellPrice: number | null;
  variantWeight: number | null;
}

// ── CJ Category Import ────────────────────────────────────────────────────────

/** Full breadcrumb data for importing a leaf category from CJ into the store. */
export interface CjImportCategoryPayload {
  leafId: string;
  leafName: string;
  level1Id: string | null;
  level1Name: string;
  level2Id: string | null;
  level2Name: string;
  /** Which CJ level is being imported: 1 = L1, 2 = L2, 3 = L3 (default). */
  targetLevel: 1 | 2 | 3;
  /**
   * Children to recursively import alongside the parent.
   * Populated for L1 (carries L2+L3 subtree) and L2 (carries L3 children).
   * Absent for L3 leaf imports.
   */
  subtreeChildren?: CjCategoryNodeDto[];
}

/** One node sent to the backend subtree import field. */
export interface ImportCjSubtreeItem {
  id: string;
  name: string;
  children: ImportCjSubtreeItem[];
}

/** Request body for the dedicated CJ category import endpoint. */
export interface ImportCjCategoryRequest {
  leafId: string;
  leafName: string;
  level1Id?: string | null;
  level1Name: string;
  level2Id?: string | null;
  level2Name: string;
  includeChain: boolean;
  /** Recursive subtree of children to import alongside the parent. */
  subTree?: ImportCjSubtreeItem[] | null;
  /** Which CJ level is being imported: 1 = L1, 2 = L2, 3 = L3 (default). */
  targetLevel?: number;
  makeActive?: boolean;
}

// ── Import CJ Product ─────────────────────────────────────────────────────────

export interface ImportCjProductRequest {
  cjProductId: string;
  nameEn: string;
  sku: string | null;
  imageUrl: string | null;
  /** Store selling price (set by admin) */
  sellPrice: string | null;
  /** CJ supplier cost price — stored as SupplierPrice for margin tracking */
  cjPrice?: string | null;
  cjCategoryId: string | null;
  oneCategoryName: string | null;
  twoCategoryName: string | null;
  threeCategoryName: string | null;
  makeActive?: boolean;
}

// ── Bulk Import CJ Products ───────────────────────────────────────────────────

export interface BulkImportVariantItem {
  /** CJ variant ID (vid) — stored as ExternalSkuId for deduplication. */
  cjVariantId: string;
  variantNameEn: string;
  imageUrl: string | null;
  sellPrice: string;
  cjPrice?: string | null;
}

export interface BulkImportCjProductsRequest {
  /** CJ parent product ID — the product is created once and all variants are linked to it. */
  cjProductId: string;
  productNameEn: string;
  items: BulkImportVariantItem[];
  cjCategoryId: string | null;
  oneCategoryName: string | null;
  twoCategoryName: string | null;
  threeCategoryName: string | null;
  makeActive?: boolean;
}

export interface BulkImportResult {
  imported: number;
  skipped: number;
  errors: string[];
}
