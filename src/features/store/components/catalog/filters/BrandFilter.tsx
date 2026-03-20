import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Tag, X } from "lucide-react";
import { Input } from "@shared/ui/input";

export default function BrandFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentBrand = searchParams.get("brand") ?? "";
  const [brand, setBrand] = useState(currentBrand);

  const updateBrand = (value: string | undefined) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set("brand", value);
    else params.delete("brand");
    params.delete("page");
    setSearchParams(params);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Tag className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Brand</h3>
      </div>
      <Input
        placeholder="Search brand..."
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") updateBrand(brand || undefined);
        }}
        className="h-8 text-xs"
      />
      {currentBrand && (
        <div className="mt-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            {currentBrand}
            <button
              onClick={() => {
                setBrand("");
                updateBrand(undefined);
              }}
              className="hover:text-primary/70"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        </div>
      )}
    </div>
  );
}
