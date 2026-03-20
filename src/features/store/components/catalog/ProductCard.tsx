import { Link } from "react-router-dom";
import { ImageOff, ShoppingCart } from "lucide-react";
import { Badge } from "@shared/ui/badge";
import type { ProductListItemDto } from "../../types";
import { formatPrice } from "../../lib/formatPrice";

interface ProductCardProps {
  product: ProductListItemDto;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasRange = product.minPrice !== product.maxPrice;

  return (
    <Link
      to={`/store/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted/30">
        {product.primaryImageUrl ? (
          <img
            src={product.primaryImageUrl}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground/30">
            <ImageOff className="h-12 w-12" />
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Quick action */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <div className="flex items-center justify-center gap-2 rounded-xl bg-background/90 backdrop-blur-md px-4 py-2.5 text-xs font-medium text-foreground shadow-lg">
            <ShoppingCart className="h-3.5 w-3.5" />
            Quick View
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {!product.inStock && (
            <Badge
              variant="secondary"
              className="bg-background/90 backdrop-blur-sm text-xs"
            >
              Out of Stock
            </Badge>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between p-4">
        {product.brand && (
          <p className="text-[10px] font-semibold text-primary uppercase tracking-widest">
            {product.brand}
          </p>
        )}
        <h3 className="mt-1.5 text-sm font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors duration-200">
          {product.title}
        </h3>
        <div className="mt-3 flex items-end justify-between">
          {hasRange ? (
            <p className="text-base font-bold text-foreground">
              {formatPrice(product.minPrice, product.currencyCode)}{" "}
              <span className="text-xs font-normal text-muted-foreground">
                –
              </span>{" "}
              {formatPrice(product.maxPrice, product.currencyCode)}
            </p>
          ) : (
            <p className="text-base font-bold text-foreground">
              {formatPrice(product.minPrice, product.currencyCode)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
