// ── Public (storefront) DTOs ──────────────────────────────────────────────────

export interface CategoryTreeDto {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string | null;
  sortOrder: number;
  children: CategoryTreeDto[];
}

// ── Admin DTOs ────────────────────────────────────────────────────────────────

export interface AdminCategoryDto {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
  parentId?: number | null;
  createdAt: string;
  updatedAt?: string | null;
  externalCategoryId?: string | null;
  supplier?: number | null; // SupplierType enum: 1 = CjDropshipping
}

// ── Request bodies ────────────────────────────────────────────────────────────

export interface CreateCategoryRequest {
  name: string;
  slug?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  parentId?: number | null;
  sortOrder: number;
  isActive: boolean;
  externalCategoryId?: string | null;
  supplier?: number | null;
}

export interface UpdateCategoryRequest {
  name: string;
  slug?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  parentId?: number | null;
  sortOrder: number;
  isActive: boolean;
}

// ── UI-only flat row ──────────────────────────────────────────────────────────

/** Derived by flattening the tree for use in the table */
export interface FlatCategory {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  parentId?: number | null;
  parentName?: string;
  depth: number;
  sortOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string | null;
}
