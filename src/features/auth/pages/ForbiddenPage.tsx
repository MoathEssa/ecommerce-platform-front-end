import { ShieldOff } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@shared/ui/button";
import { AUTH_ROUTES } from "@shared/constants";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <ShieldOff className="h-16 w-16 text-destructive" />
      <h1 className="text-2xl font-semibold">403 – Forbidden</h1>
      <p className="text-muted-foreground">
        You don&apos;t have permission to access this page.
      </p>
      <Button asChild>
        <Link to={AUTH_ROUTES.SIGN_IN}>Go to Sign In</Link>
      </Button>
    </div>
  );
}

