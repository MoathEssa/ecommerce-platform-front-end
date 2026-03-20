// ── Dashboard Summary Types ───────────────────────────────────────────────────

export interface KpiCardsDto {
  totalRevenue: number;
  prevPeriodRevenue: number;
  totalOrders: number;
  prevPeriodOrders: number;
  totalCustomers: number;
  prevPeriodCustomers: number;
  activeProducts: number;
  avgOrderValue: number;
  prevPeriodAvgOrderValue: number;
  totalRefunded: number;
  pendingOrders: number;
}

export interface RevenuePointDto {
  date: string;
  revenue: number;
  orders: number;
}

export interface OrderStatusBreakdownDto {
  status: string;
  count: number;
}

export interface TopProductDto {
  productId: number;
  title: string;
  imageUrl: string | null;
  quantitySold: number;
  revenue: number;
}

export interface RecentOrderDto {
  id: number;
  orderNumber: string;
  email: string;
  status: string;
  total: number;
  currencyCode: string;
  createdAt: string;
}

export interface LowStockItemDto {
  variantId: number;
  sku: string;
  productTitle: string;
  available: number;
}

export interface InventoryAlertDto {
  lowStockCount: number;
  outOfStockCount: number;
  lowStockItems: LowStockItemDto[];
}

export interface DashboardSummaryDto {
  kpis: KpiCardsDto;
  revenueChart: RevenuePointDto[];
  orderStatusBreakdown: OrderStatusBreakdownDto[];
  topProducts: TopProductDto[];
  recentOrders: RecentOrderDto[];
  inventoryAlert: InventoryAlertDto;
}
