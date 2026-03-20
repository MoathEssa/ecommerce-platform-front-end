import HeroBanner from "../components/home/HeroBanner";
import CategoryGrid from "../components/home/CategoryGrid";
import FeaturedProducts from "../components/home/FeaturedProducts";
import PromoBanners from "../components/home/PromoBanners";
import { Truck, Shield, Headphones } from "lucide-react";

export default function StoreHomePage() {
  return (
    <div className="space-y-0">
      <HeroBanner />

      {/* Value propositions */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            {
              icon: Truck,
              label: "Free Shipping",
              desc: "On orders over 200 SAR",
            },
            {
              icon: Shield,
              label: "Secure Payment",
              desc: "100% protected checkout",
            },
            {
              icon: Headphones,
              label: "24/7 Support",
              desc: "Dedicated help center",
            },
          ].map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="flex items-center justify-center gap-3 px-6 py-5"
            >
              <Icon className="h-6 w-6 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CategoryGrid />
      <PromoBanners />
      <FeaturedProducts />
    </div>
  );
}
