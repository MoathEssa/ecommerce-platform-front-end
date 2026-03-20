import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/select";
import type { ProductVariantDto } from "../../types";
import { formatPrice } from "../../lib/formatPrice";

interface VariantSelectorProps {
  variants: ProductVariantDto[];
  selectedId: number | null;
  onSelect: (variant: ProductVariantDto) => void;
}

export default function VariantSelector({
  variants,
  selectedId,
  onSelect,
}: VariantSelectorProps) {
  if (variants.length <= 1) return null;

  const handleChange = (value: string) => {
    const variant = variants.find((v) => String(v.id) === value);
    if (variant) onSelect(variant);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Variant</label>
      <Select
        value={selectedId != null ? String(selectedId) : undefined}
        onValueChange={handleChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a variant" />
        </SelectTrigger>
        <SelectContent>
          {variants.map((v) => {
            const isOutOfStock = v.stockStatus === "outOfStock";
            const label =
              v.variantName ||
              Object.values(v.options).join(" / ") ||
              v.sku ||
              `Variant ${v.id}`;

            return (
              <SelectItem
                key={v.id}
                value={String(v.id)}
                disabled={isOutOfStock}
              >
                <span className="flex items-center gap-2">
                  {v.variantImage && (
                    <img
                      src={v.variantImage}
                      alt=""
                      className="h-6 w-6 rounded object-cover"
                    />
                  )}
                  <span
                    className={isOutOfStock ? "line-through opacity-50" : ""}
                  >
                    {label}
                  </span>
                  <span className="text-muted-foreground">
                    {formatPrice(v.basePrice, v.currencyCode)}
                  </span>
                  {isOutOfStock && (
                    <span className="text-xs text-muted-foreground">
                      (Out of stock)
                    </span>
                  )}
                </span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
