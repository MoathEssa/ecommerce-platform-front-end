import { Link } from "react-router-dom";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "@shared/ui/button";
import { Skeleton } from "@shared/ui/skeleton";
import { useGetCartQuery } from "../api/cartApi";
import CartItemCard from "../components/cart/CartItemCard";
import CartSummary from "../components/cart/CartSummary";
import CouponInput from "../components/cart/CouponInput";

export default function StoreCartPage() {
  const { data: cart, isLoading } = useGetCartQuery();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Skeleton className="h-9 w-48 mb-8" />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted mb-5">
          <ShoppingCart className="h-9 w-9 text-muted-foreground/40" />
        </div>
        <h2 className="text-xl font-bold text-foreground">
          Your cart is empty
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Looks like you haven't added anything yet
        </p>
        <Button className="mt-6 gap-2 rounded-xl px-6" asChild>
          <Link to="/store/products">
            Start Shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Shopping Cart
        <span className="ml-2 text-base font-normal text-muted-foreground">
          ({cart.itemCount} items)
        </span>
      </h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
              currencyCode={cart.currencyCode}
            />
          ))}

          {/* Coupon */}
          <div className="pt-2">
            <CouponInput activeCoupon={cart.coupon} />
          </div>
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-32 self-start">
          <CartSummary cart={cart} />
        </div>
      </div>
    </div>
  );
}
