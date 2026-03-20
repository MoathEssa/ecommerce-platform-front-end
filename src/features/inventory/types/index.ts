export type StockStatus = "inStock" | "lowStock" | "outOfStock";

export interface InventoryListItemDto {
  variantId: number;
  sku: string;
  productTitle: string;
  options?: string;
  onHand: number;
  available: number;
  stockStatus: StockStatus;
  updatedAt: string;
}

export interface InventoryDetailDto {
  variantId: number;
  sku: string;
  productTitle: string;
  onHand: number;
  available: number;
  adjustments: AdjustmentDto[];
}

export interface AdjustmentDto {
  id: number;
  delta: number;
  reason: string;
  actorId?: string;
  createdAt: string;
}

export interface InventoryAdjustmentResultDto {
  variantId: number;
  onHand: number;
  available: number;
  adjustment: AdjustmentDto;
}

export interface CreateAdjustmentRequest {
  delta: number;
  reason: string;
}
