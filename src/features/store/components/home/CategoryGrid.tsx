import { Link } from "react-router-dom";
import { Skeleton } from "@shared/ui/skeleton";
import { useGetStorefrontCategoriesQuery } from "../../api/storeCatalogApi";
import type { CategoryTreeDto } from "../../types";
import { Package, ArrowRight } from "lucide-react";

/** Fallback images keyed by slug fragment — covers all 9 categories */
const CATEGORY_IMAGES: Record<string, string> = {
  "consumer-electronics":
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop&auto=format&q=80",
  "sports-outdoors":
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=200&h=200&fit=crop&auto=format&q=80",
  "toys-kids-babies":
    "https://images.unsplash.com/photo-1558060370-d644485927b5?w=200&h=200&fit=crop&auto=format&q=80",
  "bags-shoes":
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&h=200&fit=crop&auto=format&q=80",
  "mens-clothing":
    "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=200&h=200&fit=crop&auto=format&q=80",
  "jewelry-watches":
    "https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=200&h=200&fit=crop&auto=format&q=80",
  "health-beauty-hair":
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop&auto=format&q=80",
  "home-garden-furniture":
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop&auto=format&q=80",
  "pet-supplies":
    "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop&auto=format&q=80",
};

function getCategoryImage(slug: string): string | undefined {
  // exact match first, then partial match
  if (CATEGORY_IMAGES[slug]) return CATEGORY_IMAGES[slug];
  const key = Object.keys(CATEGORY_IMAGES).find(
    (k) => slug.includes(k) || k.includes(slug),
  );
  return key ? CATEGORY_IMAGES[key] : undefined;
}

function CategoryCard({ category }: { category: CategoryTreeDto }) {
  const imageUrl = category.imageUrl ?? getCategoryImage(category.slug);

  return (
    <Link
      to={`/store/products?categorySlug=${category.slug}`}
      className="group relative flex flex-col items-center gap-3 rounded-2xl border bg-card p-6 text-center transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 hover:border-primary/20"
    >
      <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-primary/10 text-primary transition-colors duration-300 group-hover:ring-2 group-hover:ring-primary/30">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={category.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <Package className="h-6 w-6" />
        )}
        {/* subtle primary tint on hover */}
        <div className="absolute inset-0 bg-primary/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div>
        <h3 className="font-semibold text-foreground">{category.name}</h3>
        {category.children.length > 0 && (
          <p className="mt-1 text-xs text-muted-foreground">
            {category.children.length} subcategories
          </p>
        )}
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground/50 transition-all duration-300 group-hover:text-primary group-hover:translate-x-0.5" />
    </Link>
  );
}

export default function CategoryGrid() {
  const { data: categories, isLoading } = useGetStorefrontCategoriesQuery();

  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Shop by Category
        </h2>
        <p className="mt-2 text-muted-foreground">Find exactly what you need</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {categories?.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      )}
    </section>
  );
}
