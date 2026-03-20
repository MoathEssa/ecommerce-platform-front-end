import type { CjProductListItemDto } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@shared/ui/dialog";
import { Badge } from "@shared/ui/badge";
import { Separator } from "@shared/ui/separator";
import { formatPrice } from "../utils";

function formatDate(ts: number | null | undefined): string {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function InfoRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4 py-1">
      <span className="text-muted-foreground text-sm shrink-0">{label}</span>
      <span
        className={`text-right text-sm break-all ${
          mono ? "font-mono text-xs" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

interface CjProductDetailDialogProps {
  product: CjProductListItemDto | null;
  open: boolean;
  onClose: () => void;
}

export function CjProductDetailDialog({
  product,
  open,
  onClose,
}: CjProductDetailDialogProps) {
  if (!product) return null;

  const categoryPath = [
    product.oneCategoryName,
    product.twoCategoryName,
    product.threeCategoryName,
  ]
    .filter(Boolean)
    .join(" → ");

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border/60">
        <DialogHeader>
          <DialogTitle className="text-base leading-snug pr-4">
            {product.nameEn}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-6 mt-1">
          {/* Thumbnail */}
          {product.bigImage ? (
            <img
              src={product.bigImage}
              alt={product.nameEn}
              className="w-full rounded-lg border object-cover aspect-square bg-muted"
            />
          ) : (
            <div className="w-full aspect-square rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-xs">
              No image
            </div>
          )}

          {/* Fields */}
          <div>
            <InfoRow label="Product ID" value={product.id} mono />
            <InfoRow label="SKU" value={product.sku ?? "—"} mono />
            <Separator className="my-2" />
            <InfoRow
              label="Sell price"
              value={formatPrice(product.sellPrice)}
            />
            <InfoRow
              label="Discount price"
              value={formatPrice(product.discountPrice)}
            />
            {product.discountPriceRate && (
              <InfoRow
                label="Discount rate"
                value={`${product.discountPriceRate}%`}
              />
            )}
            <Separator className="my-2" />
            <InfoRow
              label="Free shipping"
              value={product.freeShipping ? "Yes" : "No"}
            />
            <InfoRow
              label="Delivery cycle"
              value={
                product.deliveryCycle ? `${product.deliveryCycle} days` : "—"
              }
            />
            <InfoRow
              label="Inventory"
              value={
                product.warehouseInventoryNum != null
                  ? product.warehouseInventoryNum.toLocaleString()
                  : "—"
              }
            />
            <Separator className="my-2" />
            <InfoRow label="Type" value={product.productType ?? "—"} />
            <InfoRow
              label="Supplier"
              value={product.supplierName ?? "CJ Dropshipping"}
            />
            <InfoRow
              label="Listed count"
              value={
                product.listedNum != null ? String(product.listedNum) : "—"
              }
            />
            <InfoRow label="Created" value={formatDate(product.createAt)} />
            <Separator className="my-2" />
            {/* Category breadcrumb */}
            <div className="py-1">
              <span className="text-muted-foreground text-sm">Category: </span>
              <span className="text-sm">{categoryPath || "—"}</span>
            </div>
            {product.categoryId && (
              <InfoRow label="CJ Category ID" value={product.categoryId} mono />
            )}
          </div>
        </div>

        {/* Status badges */}
        <div className="flex flex-wrap gap-2 mt-2">
          {product.freeShipping && (
            <Badge
              variant="outline"
              className="text-green-700 border-green-300 dark:text-green-400 dark:border-green-700"
            >
              Free shipping
            </Badge>
          )}
          {product.productType && (
            <Badge variant="secondary">{product.productType}</Badge>
          )}
        </div>

        {/* Import action */}
        <div className="flex items-center justify-end mt-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            Close this dialog and click <strong>Variants</strong> on the row to
            import a specific variant to your store.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
