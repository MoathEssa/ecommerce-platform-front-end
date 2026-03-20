import { useSearchParams } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@shared/ui/button";
import { Separator } from "@shared/ui/separator";
import CategoryFilter from "./filters/CategoryFilter";
import PriceFilter from "./filters/PriceFilter";
import BrandFilter from "./filters/BrandFilter";
import AvailabilityFilter from "./filters/AvailabilityFilter";

export default function FilterSidebar() {
  const [searchParams, setSearchParams] = useSearchParams();

  const hasActiveFilters =
    searchParams.get("categorySlug") ||
    searchParams.get("minPrice") ||
    searchParams.get("maxPrice") ||
    searchParams.get("brand") ||
    searchParams.get("inStock");

  return (
    <aside className="space-y-5">
      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Filters Applied
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 text-xs text-destructive hover:text-destructive"
            onClick={() => setSearchParams({})}
          >
            <X className="h-3 w-3" />
            Clear All
          </Button>
        </div>
      )}

      <CategoryFilter />
      <Separator />
      <PriceFilter />
      <Separator />
      <BrandFilter />
      <Separator />
      <AvailabilityFilter />
    </aside>
  );
}
