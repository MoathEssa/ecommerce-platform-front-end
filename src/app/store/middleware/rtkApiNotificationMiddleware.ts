import { logout } from "@features/auth/store/authSlice";
import {
  isRejectedWithValue,
  isFulfilled,
  type Middleware,
} from "@reduxjs/toolkit";
import { toast } from "sonner";
import { t } from "@shared/lib/i18n";
import type { IGenericApiResponse } from "@shared/types";

/**
 * RTK Query Middleware for centralized API notification handling.
 * Handles all API responses (errors + success) and shows appropriate toasts —
 * so individual components never need try/catch or toast calls.
 */
export const rtkApiNotificationMiddleware: Middleware =
  (store) => (next) => (action) => {
    // ── Error responses (network errors + HTTP errors) ───────────────────────
    if (isRejectedWithValue(action)) {
      const payload = action.payload as {
        status?: number | string;
        data?: IGenericApiResponse<unknown>;
        error?: string;
      };

      const status = payload?.status;

      const apiErrorMessage =
        payload?.data?.errors?.[0] || payload?.data?.message || payload?.error;

      switch (status) {
        case "FETCH_ERROR":
          toast.error(t("errors.network"));
          break;

        case "TIMEOUT_ERROR":
          toast.error(t("errors.timeout"));
          break;

        case 400:
          toast.error(apiErrorMessage || t("errors.validationError"));
          break;

        case 401: {
          const endpointName = (
            action.meta as { arg?: { endpointName?: string } }
          )?.arg?.endpointName;
          // Don't show "unauthorized" when the logout call itself gets a 401
          if (endpointName !== "logout") {
            toast.error(apiErrorMessage || t("errors.unauthorized"));
          }
          store.dispatch(logout());
          break;
        }

        case 403:
          toast.error(t("errors.forbidden"));
          break;

        case 404:
          toast.error(apiErrorMessage || t("errors.notFound"));
          break;

        case 409:
          toast.error(apiErrorMessage || t("errors.conflict"));
          break;

        case 500:
        case 502:
        case 503:
          toast.error(t("errors.serverError"));
          break;

        default:
          toast.error(apiErrorMessage || t("errors.unknown"));
      }
    }

    // ── Successful mutations — show success message from backend ─────────────
    if (isFulfilled(action)) {
      const payload = action.payload as
        | IGenericApiResponse<unknown>
        | undefined;

      const endpointName = (
        action as { meta?: { arg?: { endpointName?: string; type?: string } } }
      )?.meta?.arg?.endpointName;
      const argType = (action as { meta?: { arg?: { type?: string } } })?.meta
        ?.arg?.type;

      if (argType === "mutation" && payload?.message && payload?.succeeded) {
        // These endpoints are part of compound flows — no standalone toast
        const silentEndpoints = [
          "refreshToken",
          "addCartItem",
          "removeCartItem",
        ];

        if (!silentEndpoints.includes(endpointName ?? "")) {
          toast.success(payload.message);
        }
      }
    }

    return next(action);
  };
