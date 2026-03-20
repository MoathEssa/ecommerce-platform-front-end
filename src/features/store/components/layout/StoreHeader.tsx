import { Link } from "react-router-dom";
import { Phone, Headphones } from "lucide-react";
import StoreLogo from "./StoreLogo";
import SearchBar from "./SearchBar";
import CartButton from "./CartButton";
import UserMenu from "./UserMenu";

export default function StoreHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/80 shadow-sm">
      {/* Top utility bar */}
      <div className="hidden md:block border-b border-border/50">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <Link
              to="#"
              className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <Phone className="h-3 w-3" />
              +966 50 000 0000
            </Link>
            <Link
              to="#"
              className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <Headphones className="h-3 w-3" />
              Help Center
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span>Track Order</span>
          </div>
        </div>
      </div>
      {/* Main header */}
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 lg:gap-8">
        <StoreLogo />
        <div className="flex-1 flex justify-center">
          <SearchBar />
        </div>
        <div className="flex items-center gap-1">
          <CartButton />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
