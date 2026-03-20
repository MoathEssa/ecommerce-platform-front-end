import { useState } from "react";
import { ShoppingCart, Minus, Plus, Loader2 } from "lucide-react";
import { Button } from "@shared/ui/button";
import { useAddCartItemMutation } from "../../api/cartApi";

interface AddToCartButtonProps {
  variantId: number | null;
  disabled?: boolean;
}

export default function AddToCartButton({
  variantId,
  disabled,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [addItem, { isLoading }] = useAddCartItemMutation();

  const handleAdd = async () => {
    if (!variantId) return;
    await addItem({ variantId, quantity }).unwrap();
  };

  return (
    <div className="flex items-center gap-3">
      {/* Quantity selector */}
      <div className="flex items-center rounded-lg border">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-r-none"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          disabled={quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="flex h-10 w-12 items-center justify-center text-sm font-medium">
          {quantity}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-l-none"
          onClick={() => setQuantity((q) => Math.min(99, q + 1))}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Add to cart */}
      <Button
        size="lg"
        className="flex-1 gap-2"
        disabled={!variantId || disabled || isLoading}
        onClick={handleAdd}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ShoppingCart className="h-4 w-4" />
        )}
        Add to Cart
      </Button>
    </div>
  );
}
