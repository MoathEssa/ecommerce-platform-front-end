import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@shared/ui/button";
import { useGetStorefrontProductsQuery } from "../api/storeCatalogApi";
import ProductGrid from "../components/catalog/ProductGrid";
import FilterSidebar from "../components/catalog/FilterSidebar";
import SortSelect from "../components/catalog/SortSelect";
import PaginationBar from "../components/catalog/PaginationBar";

const VALID_SORT_VALUES = [
  "relevance",
  "newest",
  "price-asc",
  "price-desc",
  "name-asc",
] as const;

export default function StoreProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const page = Number(searchParams.get("page")) || 1;
  const rawSort = searchParams.get("sortBy") ?? "relevance";
  const sortBy = (VALID_SORT_VALUES as readonly string[]).includes(rawSort)
    ? rawSort
    : "relevance";
  const categorySlug = searchParams.get("categorySlug") || undefined;
  const search = searchParams.get("search") || undefined;
  const brand = searchParams.get("brand") || undefined;
  const minPrice = searchParams.get("minPrice")
    ? Number(searchParams.get("minPrice"))
    : undefined;
  const maxPrice = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : undefined;
  const inStock = searchParams.get("inStock") === "true" ? true : undefined;

  const { data, isLoading } = useGetStorefrontProductsQuery({
    page,
    pageSize: 12,
    categorySlug,
    search,
    sortBy,
    brand,
    minPrice,
    maxPrice,
    inStock,
  });

  const updateParam = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== "page") params.delete("page");
    setSearchParams(params);
  };

  const title = search
    ? `Search: "${search}"`
    : categorySlug
      ? categorySlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : "All Products";

  const activeFilterCount = [
    categorySlug,
    brand,
    minPrice,
    maxPrice,
    inStock,
  ].filter(Boolean).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          {data && (
            <p className="mt-1 text-sm text-muted-foreground">
              {data.totalCount} product{data.totalCount !== 1 ? "s" : ""} found
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden gap-2 rounded-lg"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </Button>
          <SortSelect
            value={sortBy}
            onChange={(val) => updateParam("sortBy", val)}
          />
        </div>
      </div>

      {/* Active filter chips (mobile) */}
      {activeFilterCount > 0 && (
        <div className="mb-4 flex flex-wrap gap-2 lg:hidden">
          {categorySlug && (
            <FilterChip
              label={categorySlug.replace(/-/g, " ")}
              onRemove={() => updateParam("categorySlug", undefined)}
            />
          )}
          {brand && (
            <FilterChip
              label={`Brand: ${brand}`}
              onRemove={() => updateParam("brand", undefined)}
            />
          )}
          {(minPrice || maxPrice) && (
            <FilterChip
              label={`Price: ${minPrice ?? 0} – ${maxPrice ?? "∞"}`}
              onRemove={() => {
                const params = new URLSearchParams(searchParams);
                params.delete("minPrice");
                params.delete("maxPrice");
                params.delete("page");
                setSearchParams(params);
              }}
            />
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex gap-8">
        {/* Sidebar — desktop always, mobile toggle */}
        <div
          className={`w-60 shrink-0 ${showFilters ? "block" : "hidden"} lg:block`}
        >
          <div className="sticky top-32 rounded-xl border bg-card p-4">
            <FilterSidebar />
          </div>
        </div>

        {/* Products */}
        <div className="flex-1 min-w-0">
          <ProductGrid products={data?.items} isLoading={isLoading} />
          {data && (
            <PaginationBar
              page={page}
              totalPages={data.totalPages}
              onPageChange={(p) => updateParam("page", String(p))}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary capitalize">
      {label}
      <button onClick={onRemove} className="hover:text-primary/70 ml-0.5">
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
