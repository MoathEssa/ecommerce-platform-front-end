import { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Package,
  Tag,
  TrendingUp,
} from "lucide-react";

import { useAdminImportCjProductMutation } from "@features/catalog/api/catalogApi";
import type { CjProductVariantDto, CjProductListItemDto } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@shared/ui/dialog";
import { Button } from "@shared/ui/button";
import { Switch } from "@shared/ui/switch";
import { Label } from "@shared/ui/label";
import { Separator } from "@shared/ui/separator";
import { Badge } from "@shared/ui/badge";
import { Input } from "@shared/ui/input";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CjImportVariantPayload {
  variant: CjProductVariantDto;
  product: CjProductListItemDto;
}

interface CjImportVariantDialogProps {
  payload: CjImportVariantPayload | null;
  open: boolean;
  onClose: () => void;
}

type Status = "idle" | "loading" | "success" | "error";

// ── Component ─────────────────────────────────────────────────────────────────

export function CjImportVariantDialog({
  payload,
  open,
  onClose,
}: CjImportVariantDialogProps) {
  const [makeActive, setMakeActive] = useState(false);
  const [priceInput, setPriceInput] = useState("");
  const [priceError, setPriceError] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [importCjProduct] = useAdminImportCjProductMutation();

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen && status !== "loading") {
      handleClose();
    }
  }

  function handleClose() {
    setStatus("idle");
    setErrorMessage("");
    setMakeActive(false);
    setPriceInput("");
    setPriceError(false);
    onClose();
  }

  async function handleImport() {
    if (!payload) return;

    // Validate price
    const parsedPrice = parseFloat(priceInput.trim());
    if (!priceInput.trim() || isNaN(parsedPrice) || parsedPrice <= 0) {
      setPriceError(true);
      return;
    }
    setPriceError(false);

    const { variant, product } = payload;
    const cjRawPrice =
      variant.variantSellPrice != null
        ? String(variant.variantSellPrice)
        : (product.sellPrice ?? undefined);

    setStatus("loading");
    setErrorMessage("");

    try {
      await importCjProduct({
        cjProductId: variant.vid,
        nameEn:
          variant.variantNameEn?.trim() ||
          `${product.nameEn.trim()} – ${variant.variantKey ?? variant.variantSku ?? variant.vid}`,
        sku: variant.variantSku,
        imageUrl: variant.variantImage ?? product.bigImage,
        sellPrice: String(parsedPrice),
        cjPrice: cjRawPrice,
        cjCategoryId: product.categoryId,
        oneCategoryName: product.oneCategoryName,
        twoCategoryName: product.twoCategoryName,
        threeCategoryName: product.threeCategoryName,
        makeActive,
      }).unwrap();

      setStatus("success");
    } catch (err: unknown) {
      const msg =
        err != null &&
        typeof err === "object" &&
        "data" in err &&
        err.data != null &&
        typeof err.data === "object" &&
        "message" in err.data &&
        typeof (err.data as { message: unknown }).message === "string"
          ? (err.data as { message: string }).message
          : "An unexpected error occurred. Please try again.";
      setErrorMessage(msg);
      setStatus("error");
    }
  }

  if (!payload) return null;

  const { variant, product } = payload;
  const displayName =
    variant.variantNameEn?.trim() ||
    [product.nameEn, variant.variantKey].filter(Boolean).join(" – ");

  // CJ supplier cost price (read-only reference)
  const cjPrice =
    variant.variantSellPrice != null
      ? variant.variantSellPrice.toFixed(2)
      : (product.sellPrice ?? null);

  // Suggested retail: default the input once (if still empty) to 2x CJ price
  const suggestedPrice =
    cjPrice != null ? (parseFloat(cjPrice) * 2).toFixed(2) : "";

  // Margin preview
  const parsedInput = parseFloat(priceInput);
  const parsedCj = cjPrice != null ? parseFloat(cjPrice) : null;
  const margin =
    !isNaN(parsedInput) && parsedInput > 0 && parsedCj != null && parsedCj > 0
      ? (((parsedInput - parsedCj) / parsedInput) * 100).toFixed(1)
      : null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import variant to store</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Variant summary */}
          <div className="rounded-lg border bg-muted/30 px-4 py-3 space-y-2">
            <div className="flex items-start gap-3">
              {(variant.variantImage ?? product.bigImage) ? (
                <img
                  src={(variant.variantImage ?? product.bigImage)!}
                  alt=""
                  className="w-14 h-14 rounded object-cover bg-muted shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded bg-muted flex items-center justify-center shrink-0">
                  <Package className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <div className="min-w-0 space-y-1">
                <p className="text-sm font-medium leading-tight line-clamp-2">
                  {displayName}
                </p>
                {variant.variantKey && (
                  <div className="flex flex-wrap gap-1">
                    {variant.variantKey.split("-").map((opt) => (
                      <Badge
                        key={opt}
                        variant="secondary"
                        className="text-xs px-1.5 py-0"
                      >
                        {opt.trim()}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {variant.variantSku && (
                    <code className="bg-muted px-1.5 py-0.5 rounded">
                      {variant.variantSku}
                    </code>
                  )}
                  {variant.variantWeight != null && (
                    <span>{variant.variantWeight}g</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Pricing section */}
          <div className="space-y-3">
            {/* CJ cost price (read-only) */}
            {cjPrice && (
              <div className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    CJ supplier cost
                  </span>
                </div>
                <span className="text-sm font-semibold tabular-nums">
                  ${cjPrice}
                </span>
              </div>
            )}

            {/* Admin selling price (required input) */}
            <div className="space-y-1.5">
              <Label htmlFor="sell-price" className="text-sm font-medium">
                Your store price <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  $
                </span>
                <Input
                  id="sell-price"
                  type="number"
                  min={0.01}
                  step={0.01}
                  placeholder={suggestedPrice || "0.00"}
                  value={priceInput}
                  onChange={(e) => {
                    setPriceInput(e.target.value);
                    if (priceError) setPriceError(false);
                  }}
                  disabled={status === "loading" || status === "success"}
                  className={`pl-7 ${priceError ? "border-destructive focus-visible:ring-destructive" : ""}`}
                />
              </div>
              {priceError && (
                <p className="text-xs text-destructive">
                  Please enter a valid price greater than 0.
                </p>
              )}
              {/* Live margin preview */}
              {margin !== null && (
                <div className="flex items-center gap-1.5 text-xs">
                  <TrendingUp
                    className={`h-3.5 w-3.5 ${
                      parseFloat(margin) >= 30
                        ? "text-emerald-600"
                        : parseFloat(margin) >= 10
                          ? "text-amber-500"
                          : "text-destructive"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      parseFloat(margin) >= 30
                        ? "text-emerald-600"
                        : parseFloat(margin) >= 10
                          ? "text-amber-500"
                          : "text-destructive"
                    }`}
                  >
                    {margin}% margin
                  </span>
                  {parsedCj != null && !isNaN(parsedInput) && (
                    <span className="text-muted-foreground">
                      (+${(parsedInput - parsedCj).toFixed(2)} profit)
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Make active toggle */}
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="make-active" className="text-sm font-medium">
                Publish immediately
              </Label>
              <p className="text-xs text-muted-foreground">
                Make the product visible in the store right away. Leave off to
                save as a draft first.
              </p>
            </div>
            <Switch
              id="make-active"
              checked={makeActive}
              onCheckedChange={setMakeActive}
              disabled={status === "loading" || status === "success"}
            />
          </div>

          {/* Success */}
          {status === "success" && (
            <div className="flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
              <div className="space-y-0.5">
                <p className="text-sm font-medium">
                  Variant imported successfully!
                </p>
                <p className="text-xs opacity-80">
                  {makeActive
                    ? "The product is now live in your store."
                    : "Saved as draft — you can publish it from the products page."}
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {status === "error" && (
            <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-destructive">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Import failed</p>
                <p className="text-xs">{errorMessage}</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {status === "success" ? (
            <Button onClick={handleClose}>Done</Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={status === "loading"}
              >
                Cancel
              </Button>
              <Button onClick={handleImport} disabled={status === "loading"}>
                {status === "loading" && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {status === "loading" ? "Importing…" : "Import"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
