import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ImageOff, AlertTriangle } from "lucide-react";
import { Button } from "@shared/ui/button";
import {
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
} from "../../api/cartApi";
import { formatPrice } from "../../lib/formatPrice";
import type { CartItemDto } from "../../types";

interface CartItemCardProps {
  item: CartItemDto;
  currencyCode: string;
}

export default function CartItemCard({
  item,
  currencyCode,
}: CartItemCardProps) {
  const [updateItem, { isLoading: isUpdating }] = useUpdateCartItemMutation();
  const [removeItem, { isLoading: isRemoving }] = useRemoveCartItemMutation();

  const optionText = Object.values(item.options).join(" / ");

  return (
    <div className="flex gap-4 rounded-2xl border bg-card p-4 transition-colors hover:border-primary/10">
      {/* Image */}
      <Link
        to={`/store/products/${item.productSlug}`}
        className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted/50"
      >
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.productTitle}
            className="h-full w-full object-cover"
          />
        ) : (
          <ImageOff className="h-6 w-6 text-muted-foreground/40" />
        )}
      </Link>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <Link
            to={`/store/products/${item.productSlug}`}
            className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
          >
            {item.productTitle}
          </Link>
          {optionText && (
            <p className="mt-0.5 text-xs text-muted-foreground">{optionText}</p>
          )}
          <p className="mt-0.5 text-xs text-muted-foreground">
            SKU: {item.sku}
          </p>
        </div>

        {/* Warnings */}
        {item.warnings.length > 0 && (
          <div className="mt-1 flex items-center gap-1 text-xs text-amber-600">
            <AlertTriangle className="h-3 w-3" />
            {item.warnings[0]}
          </div>
        )}

        {/* Quantity + Price */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              disabled={item.quantity <= 1 || isUpdating}
              onClick={() =>
                updateItem({ itemId: item.id, quantity: item.quantity - 1 })
              }
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="flex h-7 w-9 items-center justify-center text-sm font-medium">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              disabled={isUpdating}
              onClick={() =>
                updateItem({ itemId: item.id, quantity: item.quantity + 1 })
              }
            >
              <Plus className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              disabled={isRemoving}
              onClick={() => removeItem(item.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
          <p className="text-sm font-bold text-foreground">
            {formatPrice(item.lineTotal, currencyCode)}
          </p>
        </div>
      </div>
    </div>
  );
}
