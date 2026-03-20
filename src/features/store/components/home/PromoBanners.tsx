import { Link } from "react-router-dom";
import { ArrowRight, Tag, Zap } from "lucide-react";

const banners = [
  {
    title: "New Season Fashion",
    subtitle: "Bags, Shoes & Clothing",
    cta: "Shop Fashion",
    href: "/store/products?categorySlug=bags-shoes",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&h=400&fit=crop&auto=format&q=80",
    accent: "from-pink-600/80 to-rose-800/90",
  },
  {
    title: "Home & Garden",
    subtitle: "Refresh Your Living Space",
    cta: "Explore Now",
    href: "/store/products?categorySlug=home-garden-furniture",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=400&fit=crop&auto=format&q=80",
    accent: "from-emerald-600/80 to-teal-800/90",
  },
];

const spotlightCategories = [
  {
    name: "Toys & Kids",
    image:
      "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&h=300&fit=crop&auto=format&q=80",
    slug: "toys-kids-babies",
    badge: "New Arrivals",
  },
  {
    name: "Jewelry & Watches",
    image:
      "https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=400&h=300&fit=crop&auto=format&q=80",
    slug: "jewelry-watches",
    badge: "Top Rated",
  },
  {
    name: "Pet Supplies",
    image:
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop&auto=format&q=80",
    slug: "pet-supplies",
    badge: "Popular",
  },
  {
    name: "Men's Clothing",
    image:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=300&fit=crop&auto=format&q=80",
    slug: "mens-clothing",
    badge: "Trending",
  },
];

export default function PromoBanners() {
  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-10">
      {/* ── Dual promo banners ── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {banners.map((b) => (
          <Link
            key={b.title}
            to={b.href}
            className="group relative overflow-hidden rounded-2xl shadow-md"
          >
            <img
              src={b.image}
              alt={b.title}
              className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {/* gradient overlay */}
            <div
              className={`absolute inset-0 bg-linear-to-r ${b.accent} opacity-80`}
            />
            <div className="absolute inset-0 flex flex-col justify-center px-8">
              <div className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                <Tag className="h-3 w-3" />
                {b.subtitle}
              </div>
              <h3 className="text-2xl font-extrabold text-white drop-shadow-sm">
                {b.title}
              </h3>
              <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white/90 transition-gap duration-200 group-hover:gap-2.5">
                {b.cta} <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Spotlight category cards ── */}
      <div>
        <div className="mb-6 flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Spotlight Categories
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {spotlightCategories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/store/products?categorySlug=${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl shadow-sm"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              {/* badge */}
              <div className="absolute right-2 top-2 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                {cat.badge}
              </div>
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
  );
}
