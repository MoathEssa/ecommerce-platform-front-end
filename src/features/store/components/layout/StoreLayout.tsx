import { Outlet } from "react-router-dom";
import StoreHeader from "./StoreHeader";
import CategoryNav from "./CategoryNav";
import StoreFooter from "./StoreFooter";

export default function StoreLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Promo banner */}
      <div className="bg-primary text-primary-foreground text-center text-xs sm:text-sm font-medium py-2 px-4">
        Free shipping on orders over 200 SAR &mdash; Shop now &amp; save!
      </div>
      <StoreHeader />
      <CategoryNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <StoreFooter />
    </div>
  );
}
