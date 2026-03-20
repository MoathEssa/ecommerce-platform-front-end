import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

import type { CjProductSearchParams } from "../types";
import { CjCategoryFilter } from "./CjCategoryFilter";
import { Input } from "@shared/ui/input";
import { Button } from "@shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@shared/ui/popover";
import { Label } from "@shared/ui/label";
import { Checkbox } from "@shared/ui/checkbox";
import { Separator } from "@shared/ui/separator";
import { Badge } from "@shared/ui/badge";

// ── Sort options ──────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { value: "sort_score", label: "Relevance" },
  { value: "create_time", label: "Newest" },
  { value: "sell_price", label: "Price" },
  { value: "warehouse_inventory_num", label: "Inventory" },
] as const;

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100, 200, 300, 400, 500, 900] as const;

const COUNTRY_OPTIONS = [
  { value: "US", label: "United States" },
  { value: "GB", label: "United Kingdom" },
  { value: "AU", label: "Australia" },
  { value: "CA", label: "Canada" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "NL", label: "Netherlands" },
  { value: "ES", label: "Spain" },
  { value: "IT", label: "Italy" },
  { value: "JP", label: "Japan" },
  { value: "BR", label: "Brazil" },
  { value: "MX", label: "Mexico" },
] as const;

// ── Props ─────────────────────────────────────────────────────────────────────

interface CjProductFiltersProps {
  params: CjProductSearchParams;
  onSearch: (keyword: string) => void;
  onParamChange: (partial: Partial<CjProductSearchParams>) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CjProductFilters({
  params,
  onSearch,
  onParamChange,
}: CjProductFiltersProps) {
  const [keyword, setKeyword] = useState(params.keyWord ?? "");
  const [minPrice, setMinPrice] = useState(
    params.startSellPrice != null ? String(params.startSellPrice) : "",
  );
  const [maxPrice, setMaxPrice] = useState(
    params.endSellPrice != null ? String(params.endSellPrice) : "",
  );
  const [freeShipping, setFreeShipping] = useState(params.addMarkStatus === 1);
  const [filterOpen, setFilterOpen] = useState(false);

  // Count active filters (category handled by CjCategoryFilter directly)
  const activeFilterCount =
    (params.startSellPrice != null ? 1 : 0) +
    (params.endSellPrice != null ? 1 : 0) +
    (params.addMarkStatus === 1 ? 1 : 0);

  function handleSearchKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") onSearch(keyword);
  }

  function applyFilters() {
    onParamChange({
      startSellPrice: minPrice !== "" ? parseFloat(minPrice) : undefined,
      endSellPrice: maxPrice !== "" ? parseFloat(maxPrice) : undefined,
      addMarkStatus: freeShipping ? 1 : undefined,
      page: 1,
    });
    setFilterOpen(false);
  }

  function clearFilters() {
    setMinPrice("");
    setMaxPrice("");
    setFreeShipping(false);
    onParamChange({
      startSellPrice: undefined,
      endSellPrice: undefined,
      addMarkStatus: undefined,
      page: 1,
    });
    setFilterOpen(false);
  }

  return (
    <div className="flex flex-wrap gap-2 items-end">
      {/* Keyword search */}
      <div className="flex gap-1.5 flex-1 min-w-[220px]">
        <Input
          placeholder="Search CJ products…"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          className="h-9"
        />
        <Button
          size="sm"
          className="h-9 px-3"
          onClick={() => onSearch(keyword)}
        >
          <Search className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Country filter */}
      <Select
        value={params.countryCode ?? "all"}
        onValueChange={(v) =>
          onParamChange({ countryCode: v === "all" ? undefined : v, page: 1 })
        }
      >
        <SelectTrigger className="h-9 w-40 text-sm">
          <SelectValue placeholder="All countries" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All countries</SelectItem>
          {COUNTRY_OPTIONS.map((c) => (
            <SelectItem key={c.value} value={c.value}>
              {c.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* CJ Category filter */}
      <CjCategoryFilter
        value={params.categoryId}
        onChange={(id) => onParamChange({ categoryId: id, page: 1 })}
      />

      {/* Product type filter */}
      <Select
        value={params.productType != null ? String(params.productType) : "all"}
        onValueChange={(v) =>
          onParamChange({
            productType: v !== "all" ? Number(v) : undefined,
            page: 1,
          })
        }
      >
        <SelectTrigger className="h-9 w-36 text-sm">
          <SelectValue placeholder="All types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          <SelectItem value="1">Ordinary</SelectItem>
          <SelectItem value="2">Special</SelectItem>
        </SelectContent>
      </Select>

      {/* Filters popover */}
      <Popover open={filterOpen} onOpenChange={setFilterOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
            {activeFilterCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-1 h-4 px-1 text-[10px] font-semibold"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-64 space-y-4">
          {/* Price range */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Price range (USD)</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={0}
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="h-8 text-sm"
              />
              <span className="text-muted-foreground text-xs">–</span>
              <Input
                type="number"
                min={0}
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
          </div>

          <Separator />

          {/* Free shipping */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="free-shipping"
              checked={freeShipping}
              onCheckedChange={(v) => setFreeShipping(Boolean(v))}
            />
            <Label htmlFor="free-shipping" className="text-sm cursor-pointer">
              Free shipping only
            </Label>
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1 h-7 text-xs"
              onClick={applyFilters}
            >
              Apply
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="flex-1 h-7 text-xs"
              onClick={clearFilters}
            >
              Clear
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Sort field */}
      <Select
        value={params.sort ?? "sort_score"}
        onValueChange={(v) => onParamChange({ sort: v, page: 1 })}
      >
        <SelectTrigger className="h-9 w-36 text-sm">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sort direction */}
      <Select
        value={String(params.orderBy ?? 1)}
        onValueChange={(v) => onParamChange({ orderBy: Number(v), page: 1 })}
      >
        <SelectTrigger className="h-9 w-28 text-sm">
          <SelectValue placeholder="Order" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">Descending</SelectItem>
          <SelectItem value="1">Ascending</SelectItem>
        </SelectContent>
      </Select>

      {/* Page size */}
      <Select
        value={String(params.size ?? 20)}
        onValueChange={(v) => onParamChange({ size: Number(v), page: 1 })}
      >
        <SelectTrigger className="h-9 w-28 text-sm">
          <SelectValue placeholder="Rows" />
        </SelectTrigger>
        <SelectContent>
          {PAGE_SIZE_OPTIONS.map((n) => (
            <SelectItem key={n} value={String(n)}>
              {n} / page
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
