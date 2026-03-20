import { useState, useMemo } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Package,
  TrendingUp,
  X,
} from "lucide-react";

import { useAdminBulkImportCjProductsMutation } from "@features/catalog/api/catalogApi";
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

export interface CjBulkImportVariantsPayload {
  variants: CjProductVariantDto[];
  product: CjProductListItemDto;
}

interface CjBulkImportVariantsDialogProps {
  payload: CjBulkImportVariantsPayload | null;
  open: boolean;
  onClose: () => void;
}

type Status = "idle" | "loading" | "success" | "error";

// ── Helpers ───────────────────────────────────────────────────────────────────

function variantDisplayName(
  v: CjProductVariantDto,
  productName: string,
): string {
  return (
    v.variantNameEn?.trim() ||
    `${productName.trim()} – ${v.variantKey ?? v.variantSku ?? v.vid}`
  );
}

function getCjPrice(v: CjProductVariantDto): number | null {
  return v.variantSellPrice ?? null;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CjBulkImportVariantsDialog({
  payload,
  open,
  onClose,
}: CjBulkImportVariantsDialogProps) {
  const [markupPct, setMarkupPct] = useState("100");
  const [markupError, setMarkupError] = useState(false);
  const [makeActive, setMakeActive] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState<{
    imported: number;
    skipped: number;
    errors: string[];
  } | null>(null);

  const [bulkImport] = useAdminBulkImportCjProductsMutation();

  // Computed store prices based on markup
  const parsedMarkup = useMemo(() => {
    const v = parseFloat(markupPct);
    return isNaN(v) || v < 0 ? null : v;
  }, [markupPct]);

  function computeStorePrice(v: CjProductVariantDto): string | null {
    const cj = getCjPrice(v);
    if (cj == null || parsedMarkup == null) return null;
    return (cj * (1 + parsedMarkup / 100)).toFixed(2);
  }

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen && status !== "loading") handleClose();
  }

  function handleClose() {
    setStatus("idle");
    setErrorMessage("");
    setResult(null);
    setMarkupPct("100");
    setMarkupError(false);
    setMakeActive(false);
    onClose();
  }

  async function handleImport() {
    if (!payload) return;

    // Validate markup
    if (parsedMarkup === null) {
      setMarkupError(true);
      return;
    }
    setMarkupError(false);

    const { variants, product } = payload;

    const items = variants.map((v) => {
      const cj = getCjPrice(v);
      const storePrice =
        cj != null && parsedMarkup != null
          ? (cj * (1 + parsedMarkup / 100)).toFixed(2)
          : (product.sellPrice ?? "0");

      return {
        cjVariantId: v.vid,
        variantNameEn: variantDisplayName(v, product.nameEn),
        imageUrl: v.variantImage ?? product.bigImage,
        sellPrice: storePrice,
        cjPrice: cj != null ? String(cj) : null,
      };
    });

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await bulkImport({
        cjProductId: product.id,
        productNameEn: product.nameEn,
        items,
        cjCategoryId: product.categoryId,
        oneCategoryName: product.oneCategoryName,
        twoCategoryName: product.twoCategoryName,
        threeCategoryName: product.threeCategoryName,
        makeActive,
      }).unwrap();

      setResult(res.data);
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

  const { variants, product } = payload;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Bulk import variants</DialogTitle>
        </DialogHeader>

        {/* ── Idle / error form ────────────────────────────────────────── */}
        {status !== "success" && (
          <div className="space-y-4 py-1 overflow-y-auto flex-1 min-h-0 pr-1">
            {/* Selected variants table */}
            <div className="rounded-lg border overflow-hidden">
              <div className="px-3 py-2 bg-muted/40 border-b">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {variants.length} variant{variants.length !== 1 ? "s" : ""}{" "}
                  selected
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y">
                {variants.map((v) => {
                  const cj = getCjPrice(v);
                  const store = computeStorePrice(v);
                  const name = variantDisplayName(v, product.nameEn);
                  return (
                    <div
                      key={v.vid}
                      className="flex items-center gap-3 px-3 py-2"
                    >
                      {v.variantImage ? (
                        <img
                          src={v.variantImage}
                          alt=""
                          className="w-8 h-8 rounded object-cover bg-muted shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                          <Package className="h-3 w-3 text-muted-foreground" />
                        </div>
                      )}
                      <span
                        className="text-xs flex-1 min-w-0 truncate leading-tight"
                        title={name}
                      >
                        {name}
                      </span>
                      <div className="text-right shrink-0">
                        {cj != null && (
                          <span className="text-[10px] text-muted-foreground block">
                            CJ ${cj.toFixed(2)}
                          </span>
                        )}
                        {store && (
                          <span className="text-xs font-semibold tabular-nums text-emerald-600">
                            → ${store}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Markup input */}
            <div className="space-y-1.5">
              <Label
                htmlFor="markup"
                className="text-xs font-medium flex items-center gap-1.5"
              >
                <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                Markup (% above CJ cost)
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="markup"
                  type="number"
                  min="0"
                  step="5"
                  placeholder="e.g. 100"
                  value={markupPct}
                  onChange={(e) => {
                    setMarkupPct(e.target.value);
                    setMarkupError(false);
                  }}
                  className={`h-9 w-28 ${markupError ? "border-destructive ring-destructive/20 ring-2" : ""}`}
                  disabled={status === "loading"}
                />
                <span className="text-xs text-muted-foreground">%</span>
                {parsedMarkup != null && (
                  <Badge variant="secondary" className="text-xs ml-auto">
                    Store price = CJ × {((parsedMarkup + 100) / 100).toFixed(2)}
                  </Badge>
                )}
              </div>
              {markupError && (
                <p className="text-xs text-destructive">
                  Enter a valid markup percentage (0 or above).
                </p>
              )}
              <p className="text-[11px] text-muted-foreground">
                100% markup = store price is 2× the CJ supplier cost. Variants
                with no CJ price will use the product's list price.
              </p>
            </div>

            <Separator />

            {/* Make active toggle */}
            <div className="flex items-center gap-3">
              <Switch
                id="makeActive"
                checked={makeActive}
                onCheckedChange={setMakeActive}
                disabled={status === "loading"}
              />
              <Label htmlFor="makeActive" className="text-sm cursor-pointer">
                Publish immediately
                <span className="block text-xs text-muted-foreground font-normal">
                  Off = imported as Draft
                </span>
              </Label>
            </div>

            {/* Error banner */}
            {status === "error" && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>
        )}

        {/* ── Success state ─────────────────────────────────────────────── */}
        {status === "success" && result && (
          <div className="py-4 space-y-3">
            <div className="flex items-center gap-3 text-emerald-600">
              <CheckCircle2 className="h-6 w-6 shrink-0" />
              <div>
                <p className="font-semibold">
                  {result.imported} variant{result.imported !== 1 ? "s" : ""}{" "}
                  imported
                </p>
                {result.skipped > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {result.skipped} already existed and were skipped.
                  </p>
                )}
              </div>
            </div>
            {result.errors.length > 0 && (
              <div className="rounded-lg border border-amber-300 bg-amber-50/40 dark:bg-amber-950/20 px-3 py-2 space-y-1">
                <p className="text-xs font-semibold text-amber-700 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {result.errors.length} error
                  {result.errors.length !== 1 ? "s" : ""}
                </p>
                {result.errors.map((e, i) => (
                  <p key={i} className="text-xs text-amber-700 truncate">
                    {e}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {status === "success" ? (
            <Button onClick={handleClose}>Done</Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={status === "loading"}
              >
                <X className="h-3.5 w-3.5 mr-1.5" />
                Cancel
              </Button>
              <Button onClick={handleImport} disabled={status === "loading"}>
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    Importing…
                  </>
                ) : (
                  <>
                    Import {variants.length} variant
                    {variants.length !== 1 ? "s" : ""}
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
