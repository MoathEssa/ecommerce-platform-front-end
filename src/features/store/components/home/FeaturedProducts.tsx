import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@shared/ui/button";
import { Skeleton } from "@shared/ui/skeleton";
import { useGetStorefrontProductsQuery } from "../../api/storeCatalogApi";
import ProductCard from "../catalog/ProductCard";

export default function FeaturedProducts() {
  const { data, isLoading } = useGetStorefrontProductsQuery({
    page: 1,
    pageSize: 8,
    sortBy: "newest",
  });

  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            New Arrivals
          </h2>
          <p className="mt-2 text-muted-foreground">
            Fresh products just added to our store
          </p>
        </div>
        <Button
          variant="ghost"
          asChild
          className="hidden sm:flex gap-1 text-primary hover:text-primary"
        >
          <Link to="/store/products">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square rounded-2xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {data?.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <div className="mt-8 text-center sm:hidden">
        <Button variant="outline" asChild className="gap-1 rounded-xl">
          <Link to="/store/products">
            View All Products <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
