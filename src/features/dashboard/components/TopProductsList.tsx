import { Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@shared/ui/avatar";
import type { TopProductDto } from "../types";

interface TopProductsListProps {
  products: TopProductDto[];
}

export default function TopProductsList({ products }: TopProductsListProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Trophy className="h-4 w-4 text-amber-500" />
          Top Products
        </CardTitle>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No product sales yet.
          </p>
        ) : (
          <div className="space-y-3">
            {products.map((product, i) => (
              <div
                key={product.productId}
                className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                  {i + 1}
                </span>
                <Avatar size="sm">
                  {product.imageUrl ? (
                    <AvatarImage src={product.imageUrl} alt={product.title} />
                  ) : null}
                  <AvatarFallback>
                    {product.title.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {product.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {product.quantitySold} sold
                  </p>
                </div>
                <span className="text-sm font-semibold whitespace-nowrap">
                  $
                  {product.revenue.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
