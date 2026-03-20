import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@app/store";

/**
 * Wraps public auth pages (sign-in, register, etc.).
 * Redirects already-authenticated users away to the home page.
 */
export default function GuestGuard() {
  const user = useAppSelector((s) => s.auth.user);

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

