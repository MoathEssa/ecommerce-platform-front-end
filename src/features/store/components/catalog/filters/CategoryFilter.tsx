import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { cn } from "@shared/lib/utils";
import { ChevronRight, Layers } from "lucide-react";
import { useGetStorefrontCategoriesQuery } from "../../../api/storeCatalogApi";
import type { CategoryTreeDto } from "../../../types";

function CategoryItem({
  category,
  activeSlug,
  depth = 0,
}: {
  category: CategoryTreeDto;
  activeSlug: string | null;
  depth?: number;
}) {
  const isActive = category.slug === activeSlug;
  const hasActiveChild = category.children.some(
    (c) =>
      c.slug === activeSlug || c.children.some((gc) => gc.slug === activeSlug),
  );
  const [expanded, setExpanded] = useState(isActive || hasActiveChild);

  return (
    <div>
      <div
        className="flex items-center group"
        style={{ paddingLeft: `${depth * 16}px` }}
      >
        <Link
          to={`/store/products?categorySlug=${category.slug}`}
          className={cn(
            "flex-1 rounded-lg px-3 py-1.5 text-[13px] transition-colors",
            isActive
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:bg-accent hover:text-foreground",
          )}
        >
          {category.name}
        </Link>
        {category.children.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronRight
              className={cn(
                "h-3 w-3 transition-transform duration-200",
                expanded && "rotate-90",
              )}
            />
          </button>
        )}
      </div>
      {expanded &&
        category.children.map((child) => (
          <CategoryItem
            key={child.id}
            category={child}
            activeSlug={activeSlug}
            depth={depth + 1}
          />
        ))}
    </div>
  );
}

export default function CategoryFilter() {
  const [searchParams] = useSearchParams();
  const activeSlug = searchParams.get("categorySlug");
  const { data: categories } = useGetStorefrontCategoriesQuery();

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Layers className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Categories</h3>
      </div>
      <div className="space-y-0.5 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
        <Link
          to="/store/products"
          className={cn(
            "block rounded-lg px-3 py-1.5 text-[13px] transition-colors",
            !activeSlug
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:bg-accent hover:text-foreground",
          )}
        >
          All Products
        </Link>
        {categories?.map((cat) => (
          <CategoryItem key={cat.id} category={cat} activeSlug={activeSlug} />
        ))}
      </div>
    </div>
  );
}
