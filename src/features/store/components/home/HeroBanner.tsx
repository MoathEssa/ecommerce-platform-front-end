import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@shared/ui/button";

const showcaseImages = [
  {
    name: "Electronics",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=480&h=320&fit=crop&auto=format&q=80",
    slug: "consumer-electronics",
  },
  {
    name: "Fashion & Bags",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=480&h=320&fit=crop&auto=format&q=80",
    slug: "bags-shoes",
  },
  {
    name: "Sports & Outdoors",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=480&h=320&fit=crop&auto=format&q=80",
    slug: "sports-outdoors",
  },
  {
    name: "Beauty & Care",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=480&h=320&fit=crop&auto=format&q=80",
    slug: "health-beauty-hair",
  },
];

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-primary/5 via-background to-accent/10">
      {/* Decorative blobs */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute right-1/3 top-1/2 h-56 w-56 rounded-full bg-yellow-400/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-22 lg:py-28">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* ── Left: text ── */}
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Free shipping on orders over 200 SAR
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1]!">
              Shop Everything{" "}
              <span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                You Love
              </span>
            </h1>

            <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
              From consumer electronics and fashion to sports gear, home
              essentials, beauty, toys, and beyond — thousands of products from
              trusted brands at competitive prices.
            </p>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-8 py-1">
              {[
                { value: "10K+", label: "Products" },
                { value: "50+", label: "Brands" },
                { value: "9", label: "Categories" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-extrabold text-foreground">
                    {value}
                  </p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <Button
                size="lg"
                asChild
                className="rounded-xl px-8 shadow-lg shadow-primary/20"
              >
                <Link to="/store/products" className="gap-2">
                  Shop Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-xl px-8"
              >
                <Link to="/store">Browse Categories</Link>
              </Button>
            </div>
          </div>

          {/* ── Right: category image grid ── */}
          <div className="hidden grid-cols-2 gap-3 lg:grid">
            {showcaseImages.map((cat, i) => (
              <Link
                key={cat.slug}
                to={`/store/products?categorySlug=${cat.slug}`}
                className={`group relative overflow-hidden rounded-2xl shadow-md ${
                  i === 0 ? "row-span-1" : ""
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                {/* dark overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent" />
                {/* primary tint on hover */}
                <div className="absolute inset-0 bg-primary/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 p-3">
                  <p className="text-sm font-semibold text-white drop-shadow">
                    {cat.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
