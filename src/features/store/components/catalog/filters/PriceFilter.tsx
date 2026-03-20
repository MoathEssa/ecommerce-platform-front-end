import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DollarSign } from "lucide-react";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Slider } from "@shared/ui/slider";

const PRICE_MAX = 500;

export default function PriceFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentMin = searchParams.get("minPrice") ?? "";
  const currentMax = searchParams.get("maxPrice") ?? "";

  const [range, setRange] = useState<[number, number]>([
    currentMin ? Number(currentMin) : 0,
    currentMax ? Number(currentMax) : PRICE_MAX,
  ]);

  const applyPrice = () => {
    const params = new URLSearchParams(searchParams);
    if (range[0] > 0) params.set("minPrice", String(range[0]));
    else params.delete("minPrice");
    if (range[1] < PRICE_MAX) params.set("maxPrice", String(range[1]));
    else params.delete("maxPrice");
    params.delete("page");
    setSearchParams(params);
  };

  const hasCustomRange = range[0] > 0 || range[1] < PRICE_MAX;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <DollarSign className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Price Range</h3>
      </div>

      <Slider
        min={0}
        max={PRICE_MAX}
        step={5}
        value={range}
        onValueChange={(val) => setRange(val as [number, number])}
        className="mb-3"
      />

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            $
          </span>
          <Input
            type="number"
            min={0}
            max={range[1]}
            value={range[0]}
            onChange={(e) =>
              setRange([Math.max(0, Number(e.target.value)), range[1]])
            }
            className="h-8 pl-6 text-xs"
          />
        </div>
        <span className="text-muted-foreground text-xs">—</span>
        <div className="relative flex-1">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            $
          </span>
          <Input
            type="number"
            min={range[0]}
            max={PRICE_MAX}
            value={range[1]}
            onChange={(e) =>
              setRange([range[0], Math.min(PRICE_MAX, Number(e.target.value))])
            }
            className="h-8 pl-6 text-xs"
          />
        </div>
      </div>

      {hasCustomRange && (
        <Button
          variant="secondary"
          size="sm"
          className="mt-2 w-full h-7 text-xs"
          onClick={applyPrice}
        >
          Apply Price
        </Button>
      )}
    </div>
  );
}
