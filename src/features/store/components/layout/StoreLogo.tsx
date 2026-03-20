import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

export default function StoreLogo() {
  return (
    <Link to="/store" className="flex items-center gap-2.5 group shrink-0">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary to-primary/80 text-primary-foreground shadow-md shadow-primary/20 transition-transform group-hover:scale-105">
        <ShoppingBag className="h-5 w-5" strokeWidth={1.8} />
      </div>
      <div className="hidden sm:flex flex-col leading-none">
        <span className="text-base font-bold tracking-tight text-foreground">
          ECommerce
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">
          Center
        </span>
      </div>
    </Link>
  );
}
