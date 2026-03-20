import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

import { API_BASE_URL, AUTH_ROUTES } from "@shared/constants";
import type { ApiResponse, LoginResponse } from "@shared/types";
import { setCredentials, clearAuth } from "@features/auth/store/authSlice";

// Minimal local type so we don't create a circular dep by importing RootState
type AuthSliceState = { auth: { accessToken: string | null } };

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${API_BASE_URL || ""}/api`,
  credentials: "include", // sends HttpOnly refresh-token cookie
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as AuthSliceState).auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Endpoints that must never trigger a silent token-refresh attempt —
// either they are public (no token needed) or they are part of the auth
// flow itself and a 401 should be surfaced directly to the caller.
const NO_REAUTH_ENDPOINTS = [
  "/Auth/login",
  "/Auth/google",
  "/Auth/register",
  "/Auth/logout",
  "/Auth/refresh-token",
  "/Auth/forgot-password",
  "/Auth/set-password",
];

// Automatically retries any request that fails with 401 after a silent
// token-refresh via the HttpOnly cookie.
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  const url = typeof args === "string" ? args : args.url;
  const isPublicEndpoint = NO_REAUTH_ENDPOINTS.some((ep) => url.includes(ep));

  if (result.error?.status === 401 && !isPublicEndpoint) {
    const refreshResult = await rawBaseQuery(
      { url: "/Auth/refresh-token", method: "POST" },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      const response = refreshResult.data as ApiResponse<LoginResponse>;
      api.dispatch(
        setCredentials({
          user: response.data.user,
          accessToken: response.data.accessToken,
        }),
      );
      // Retry the original request with the new token now in Redux state
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(clearAuth());
      window.location.href = AUTH_ROUTES.SIGN_IN;
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Categories",
    "CjCategories",
    "Products",
    "ProductImages",
    "StoreCategories",
    "StoreProducts",
    "Cart",
    "Inventory",
    "AdminCarts",
    "Coupons",
    "Charges",
  ],
  endpoints: () => ({}),
});
