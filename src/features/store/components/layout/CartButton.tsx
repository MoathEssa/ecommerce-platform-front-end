import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@shared/ui/button";
import { useGetCartQuery } from "../../api/cartApi";

export default function CartButton() {
  const { data: cart } = useGetCartQuery();
  const count = cart?.itemCount ?? 0;

  return (
    <Button variant="ghost" size="icon" className="relative h-10 w-10" asChild>
      <Link to="/store/cart">
        <ShoppingCart className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-sm shadow-primary/30 animate-in zoom-in-50 duration-200">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </Link>
    </Button>
  );
}
