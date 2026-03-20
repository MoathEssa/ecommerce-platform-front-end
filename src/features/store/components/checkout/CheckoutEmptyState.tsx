import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@shared/ui/button";

export default function CheckoutEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-5">
        <ShoppingCart className="h-8 w-8 text-muted-foreground/40" />
      </div>
      <h2 className="text-xl font-bold">No items to checkout</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Add some products to your cart first
      </p>
      <Button className="mt-6 rounded-xl px-6" asChild>
        <Link to="/store/products">Continue Shopping</Link>
      </Button>
    </div>
  );
}
