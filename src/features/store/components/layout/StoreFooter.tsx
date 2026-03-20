import { Link } from "react-router-dom";
import { ShoppingBag, Mail, MapPin, Phone } from "lucide-react";

export default function StoreFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-primary to-primary/80 text-primary-foreground shadow-sm">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-bold">ECommerce</span>
                <span className="text-[9px] font-semibold uppercase tracking-widest text-primary">
                  Center
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your one-stop destination for electronics, fashion, sports, home
              essentials, beauty, and much more — all at competitive prices.
            </p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" />
                <span>support@ecommercecenter.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" />
                <span>+966 50 000 0000</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" />
                <span>Riyadh, Saudi Arabia</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Shop</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/store/products"
                  className="hover:text-primary transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/store"
                  className="hover:text-primary transition-colors"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/store/products?sortBy=newest"
                  className="hover:text-primary transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Account</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/auth/sign-in"
                  className="hover:text-primary transition-colors"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  to="/auth/register"
                  className="hover:text-primary transition-colors"
                >
                  Create Account
                </Link>
              </li>
              <li>
                <Link
                  to="/store/cart"
                  className="hover:text-primary transition-colors"
                >
                  My Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Support</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="hover:text-primary transition-colors cursor-default">
                Shipping &amp; Returns
              </li>
              <li className="hover:text-primary transition-colors cursor-default">
                Contact Us
              </li>
              <li className="hover:text-primary transition-colors cursor-default">
                FAQ
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} ECommerceCenter. All rights
            reserved.
          </p>
          <p>Prices are in SAR. All taxes included.</p>
        </div>
      </div>
    </footer>
  );
}
