import { Link } from "react-router-dom";
import { User, LogIn } from "lucide-react";
import { Button } from "@shared/ui/button";
import { useAppSelector } from "@app/store";

export default function UserMenu() {
  const user = useAppSelector((s) => s.auth.user);

  if (!user) {
    return (
      <Button
        variant="outline"
        size="sm"
        asChild
        className="gap-2 rounded-lg h-10 px-4 font-medium"
      >
        <Link to="/auth/sign-in">
          <LogIn className="h-4 w-4" />
          <span className="hidden sm:inline">Sign In</span>
        </Link>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-10 w-10 rounded-full"
      asChild
    >
      <Link to="/">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          <User className="h-4 w-4" />
        </div>
      </Link>
    </Button>
  );
}
