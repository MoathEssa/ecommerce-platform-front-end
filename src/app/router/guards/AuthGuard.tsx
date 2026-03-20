import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@app/store";
import { useGetCurrentUserQuery } from "@features/auth";
import { AUTH_ROUTES } from "@shared/constants";
import { Skeleton } from "@shared/ui/skeleton";

/**
 * Wraps all protected routes.
 * On first mount it calls GET /api/Auth/me to attempt silent rehydration
 * via the HttpOnly refresh-token cookie.  Until that check completes
 * we show a full-page skeleton so routes don't flicker.
 */
export default function AuthGuard() {
  const { user, accessToken, isAuthChecked } = useAppSelector((s) => s.auth);

  // Skip the /me call when we already have a token in memory (e.g. just logged
  // in) or when we already know auth status (isAuthChecked).
  const { isLoading } = useGetCurrentUserQuery(undefined, {
    skip: isAuthChecked || !!accessToken,
  });

  const checked = isAuthChecked || !!accessToken;

  if (!checked || isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Skeleton className="h-12 w-48" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={AUTH_ROUTES.SIGN_IN} replace />;
  }

  return <Outlet />;
}
