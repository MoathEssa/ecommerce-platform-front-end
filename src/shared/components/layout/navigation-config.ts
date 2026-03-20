import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Tag,
  Banknote,
  Package,
  Layers,
  Settings2,
  Store,
  Truck,
} from "lucide-react";

export interface NavItem {
  id: string;
  titleKey: string; // i18n key (layout namespace)
  icon?: LucideIcon;
  url?: string;
  items?: NavItem[]; // nested sub-items
  badge?: number;
  roles?: string[];
}

export interface NavGroup {
  id: string;
  titleKey: string;
  items: NavItem[];
}

export const navigationConfig: NavGroup[] = [
  // ── Main ────────────────────────────────────────────────────────────────────
  {
    id: "main",
    titleKey: "sidebar.groups.main",
    items: [
      {
        id: "dashboard",
        titleKey: "sidebar.nav.dashboard",
        icon: LayoutDashboard,
        url: "/",
      },
      {
        id: "storefront",
        titleKey: "sidebar.nav.storefront",
        icon: Store,
        url: "/store",
      },
    ],
  },

  // ── Store ────────────────────────────────────────────────────────────────────
  {
    id: "store",
    titleKey: "sidebar.groups.store",
    items: [
      {
        id: "catalog",
        titleKey: "sidebar.nav.catalog",
        icon: ShoppingBag,
        items: [
          {
            id: "catalog-products",
            titleKey: "sidebar.nav.products",
            icon: Package,
            url: "/catalog/products",
          },
          {
            id: "catalog-categories-list",
            titleKey: "sidebar.nav.categoriesList",
            icon: Layers,
            url: "/catalog/categories",
          },
          {
            id: "catalog-categories-manage",
            titleKey: "sidebar.nav.categoriesManage",
            icon: Settings2,
            url: "/catalog/categories/manage",
          },
          {
            id: "catalog-cj-categories",
            titleKey: "sidebar.nav.supplierCjCategories",
            icon: Truck,
            url: "/catalog/suppliers/cj/categories",
            roles: ["Admin"],
          },
          {
            id: "catalog-cj-products",
            titleKey: "sidebar.nav.supplierCjProducts",
            icon: Package,
            url: "/catalog/suppliers/cj/products",
            roles: ["Admin"],
          },
        ],
      },
      {
        id: "cart",
        titleKey: "sidebar.nav.cart",
        icon: ShoppingCart,
        url: "/cart",
      },
      {
        id: "payments",
        titleKey: "sidebar.nav.payments",
        icon: Banknote,
        url: "/payments",
      },
    ],
  },

  // ── Management ───────────────────────────────────────────────────────────────
  {
    id: "management",
    titleKey: "sidebar.groups.management",
    items: [
      {
        id: "coupons",
        titleKey: "sidebar.nav.coupons",
        icon: Tag,
        url: "/coupons",
        roles: ["Admin"],
      },
      {
        id: "inventory",
        titleKey: "sidebar.nav.inventory",
        icon: Package,
        url: "/inventory",
        roles: ["Admin"],
      },
    ],
  },
];
