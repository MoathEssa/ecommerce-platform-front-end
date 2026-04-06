import { createBrowserRouter } from "react-router-dom";

import AuthGuard from "./guards/AuthGuard";
import GuestGuard from "./guards/GuestGuard";
import ApplicationLayout from "@shared/components/layout/ApplicationLayout";

import {
  SignInPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  SetPasswordPage,
  ForbiddenPage,
} from "@features/auth";

import DashboardPage from "@features/dashboard/pages/DashboardPage";
import CategoriesPage from "@/features/catalog/pages/CategoryListPage";
import ManageCategoryPage from "@/features/catalog/pages/SaveCategoryPage";
import CjCategoriesPage from "@/features/catalog/pages/CjCategoriesPage";
import CjProductsPage from "@/features/catalog/pages/CjProductsPage";
import ProductListPage from "@/features/catalog/pages/ProductListPage";
import SaveProductPage from "@/features/catalog/pages/SaveProductPage";
import CartPage from "@features/cart/pages/CartPage";
import InventoryPage from "@features/inventory/pages/InventoryPage";
import CouponsPage from "@features/coupons/pages/CouponsPage";
import PaymentsPage from "@features/payments/pages/PaymentsPage";

import {
  StoreLayout,
  StoreHomePage,
  StoreProductListPage,
  StoreProductDetailPage,
  StoreCartPage,
  StoreCheckoutPage,
  StorePaymentPage,
  StoreOrderSuccessPage,
} from "@features/store";

const router = createBrowserRouter([
  // ── Auth (Guest-guarded) ────────────────────────────────────────────────────
  {
    element: <GuestGuard />,
    children: [
      { path: "/auth/sign-in", element: <SignInPage /> },
      { path: "/auth/register", element: <RegisterPage /> },
      { path: "/auth/forgot-password", element: <ForgotPasswordPage /> },
      { path: "/auth/reset-password", element: <ResetPasswordPage /> },
      { path: "/auth/set-password", element: <SetPasswordPage /> },
    ],
  },

  // ── Public misc ────────────────────────────────────────────────────────────
  { path: "/auth/forbidden", element: <ForbiddenPage /> },

  // ── Protected (Auth-guarded + AppLayout) ───────────────────────────────────
  {
    element: <AuthGuard />,
    children: [
      {
        element: <ApplicationLayout />,
        children: [
          { path: "/", element: <DashboardPage /> },
          { path: "/catalog/categories", element: <CategoriesPage /> },
          {
            path: "/catalog/categories/manage",
            element: <ManageCategoryPage />,
          },
          {
            path: "/catalog/suppliers/cj/categories",
            element: <CjCategoriesPage />,
          },
          {
            path: "/catalog/suppliers/cj/products",
            element: <CjProductsPage />,
          },
          { path: "/catalog/products", element: <ProductListPage /> },
          { path: "/catalog/products/new", element: <SaveProductPage /> },
          {
            path: "/catalog/products/:id/edit",
            element: <SaveProductPage />,
          },
          { path: "/cart", element: <CartPage /> },
          { path: "/inventory", element: <InventoryPage /> },
          { path: "/coupons", element: <CouponsPage /> },
          { path: "/payments", element: <PaymentsPage /> },
        ],
      },
    ],
  },

  // ── Storefront (Public) ────────────────────────────────────────────────────
  {
    element: <StoreLayout />,
    children: [
      { path: "/store", element: <StoreHomePage /> },
      { path: "/store/products", element: <StoreProductListPage /> },
      { path: "/store/products/:slug", element: <StoreProductDetailPage /> },
      { path: "/store/cart", element: <StoreCartPage /> },
      { path: "/store/checkout", element: <StoreCheckoutPage /> },
      { path: "/store/checkout/payment", element: <StorePaymentPage /> },
      { path: "/store/checkout/success", element: <StoreOrderSuccessPage /> },
    ],
  },
]);

export default router;
