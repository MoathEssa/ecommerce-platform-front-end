import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  CreditCard,
  Tag,
  Menu,
  X,
  LogOut,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { useAppDispatch, useAppSelector } from "@app/store";
import { clearAuth, useLogoutMutation } from "@features/auth";
import { APP_ROUTES, AUTH_ROUTES } from "@shared/constants";
import { Button } from "@shared/ui/button";
import { Avatar, AvatarFallback } from "@shared/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shared/ui/dropdown-menu";
import { Separator } from "@shared/ui/separator";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, to: APP_ROUTES.HOME },
  { label: "Catalog", icon: ShoppingBag, to: APP_ROUTES.CATALOG },
  { label: "Cart", icon: ShoppingCart, to: APP_ROUTES.CART },
  { label: "Checkout", icon: CreditCard, to: APP_ROUTES.CHECKOUT },
  { label: "Coupons", icon: Tag, to: APP_ROUTES.COUPONS },
  { label: "Payments", icon: CreditCard, to: APP_ROUTES.PAYMENTS },
] as const;

export default function AppLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logout] = useLogoutMutation();

  function handleLogout() {
    dispatch(clearAuth()); // immediately clear local state
    logout(); // fire server logout in background
    toast.success("Signed out.");
    navigate(AUTH_ROUTES.SIGN_IN);
  }

  const initials =
    [user?.firstName?.[0], user?.lastName?.[0]]
      .filter(Boolean)
      .join("")
      .toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    "?";

  const sidebar = (
    <aside className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <Link to="/" className="text-lg font-bold text-sidebar-foreground">
          E-Commerce Center
        </Link>
      </div>
      <Separator />
      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map(({ label, icon: Icon, to }) => (
          <Link
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">{sidebar}</div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-50 h-full w-64">{sidebar}</div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>

          {/* User menu */}
          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 h-9">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm md:block">
                    {user?.firstName ?? user?.email}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to={AUTH_ROUTES.ACCOUNT_SETTINGS}>
                    <User className="mr-2 h-4 w-4" />
                    Account Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
