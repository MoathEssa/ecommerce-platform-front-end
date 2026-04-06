export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5036";

export const AUTH_ROUTES = {
  SIGN_IN: "/auth/sign-in",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  SET_PASSWORD: "/auth/set-password",
  ACCOUNT_SETTINGS: "/auth/account-settings",
  FORBIDDEN: "/auth/forbidden",
} as const;

export const APP_ROUTES = {
  HOME: "/",
  CATALOG: "/catalog",
  CART: "/cart",
  CHECKOUT: "/checkout",
  COUPONS: "/coupons",
  PAYMENTS: "/payments",
} as const;
