import { useState, useMemo } from "react";
import {
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Package,
  X,
} from "lucide-react";

import { useAdminBulkImportCjProductsMutation } from "@features/catalog/api/catalogApi";
import type { CjProductListItemDto } from "../types";
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
import { ScrollArea } from "@shared/ui/scroll-area";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ImportedRow {
  product: CjProductListItemDto;
  imported: number;
  skipped: number;
  errors: string[];
}

interface CjMultiProductImportDialogProps {
  products: CjProductListItemDto[];
  open: boolean;
  onClose: () => void;
}

type Status = "idle" | "loading" | "done" | "error";

// ── Component ─────────────────────────────────────────────────────────────────

export function CjMultiProductImportDialog({
  products,
  open,
  onClose,
}: CjMultiProductImportDialogProps) {
  const [markupPct, setMarkupPct] = useState("100");
  const [markupError, setMarkupError] = useState(false);
  const [makeActive, setMakeActive] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [results, setResults] = useState<ImportedRow[]>([]);
  const [fatalError, setFatalError] = useState("");

  const [bulkImport] = useAdminBulkImportCjProductsMutation();

  const parsedMarkup = useMemo(() => {
    const v = parseFloat(markupPct);
    return isNaN(v) || v < 0 ? null : v;
  }, [markupPct]);

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen && status !== "loading") handleClose();
  }

  function handleClose() {
    setStatus("idle");
    setFatalError("");
    setResults([]);
    setMarkupPct("100");
    setMarkupError(false);
    setMakeActive(false);
    onClose();
  }

  async function handleImport() {
    if (parsedMarkup === null) {
      setMarkupError(true);
      return;
    }
    setMarkupError(false);
    setStatus("loading");
    setFatalError("");

    const rows: ImportedRow[] = [];

    for (const product of products) {
      const cjPrice = product.sellPrice ? parseFloat(product.sellPrice) : null;
      const storePrice =
        cjPrice != null ? (cjPrice * (1 + parsedMarkup / 100)).toFixed(2) : "0";

      try {
        const res = await bulkImport({
          cjProductId: product.id,
          productNameEn: product.nameEn,
          items: [
            {
              cjVariantId: product.id,
              variantNameEn: product.nameEn,
              imageUrl: product.bigImage,
              sellPrice: storePrice,
              cjPrice: product.sellPrice,
            },
          ],
          cjCategoryId: product.categoryId,
          oneCategoryName: product.oneCategoryName,
          twoCategoryName: product.twoCategoryName,
          threeCategoryName: product.threeCategoryName,
          makeActive,
        }).unwrap();

        rows.push({
          product,
          imported: res.data.imported,
          skipped: res.data.skipped,
          errors: res.data.errors,
        });
      } catch {
        rows.push({
          product,
          imported: 0,
          skipped: 1,
          errors: ["Import failed"],
        });
      }
    }

    setResults(rows);
    setStatus("done");
  }

  const totalImported = results.reduce((s, r) => s + r.imported, 0);
  const totalSkipped = results.reduce((s, r) => s + r.skipped, 0);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            Import {products.length} product{products.length !== 1 ? "s" : ""}
          </DialogTitle>
        </DialogHeader>

        {/* ── Success summary ──────────────────────────────────────────── */}
        {status === "done" && (
          <div className="space-y-4 py-2 overflow-y-auto flex-1 min-h-0">
            <div className="flex items-center gap-3 rounded-lg border border-green-300 bg-green-50 dark:bg-green-950/30 dark:border-green-800 px-4 py-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
              <div className="text-sm">
                <span className="font-semibold text-green-700 dark:text-green-400">
                  {totalImported} imported
                </span>
                {totalSkipped > 0 && (
                  <span className="text-muted-foreground ml-2">
                    · {totalSkipped} skipped (already in store)
                  </span>
                )}
              </div>
            </div>

            <ScrollArea className="max-h-60">
              <div className="divide-y rounded-lg border overflow-hidden">
                {results.map(({ product, imported, errors }) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 px-3 py-2"
                  >
                    {product.bigImage ? (
                      <img
                        src={product.bigImage}
                        alt=""
                        className="w-8 h-8 rounded object-cover bg-muted shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                        <Package className="h-3 w-3 text-muted-foreground" />
                      </div>
                    )}
                    <span className="text-xs flex-1 min-w-0 truncate">
                      {product.nameEn}
                    </span>
                    {errors.length > 0 ? (
                      <Badge variant="destructive" className="text-[10px]">
                        Failed
                      </Badge>
                    ) : imported > 0 ? (
                      <Badge
                        variant="secondary"
                        className="text-[10px] text-green-700 dark:text-green-400"
                      >
                        Imported
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px]">
                        Skipped
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* ── Form ──────────────────────────────────────────────────────── */}
        {status !== "done" && (
          <div className="space-y-4 py-1 overflow-y-auto flex-1 min-h-0 pr-1">
            {/* Product list */}
            <div className="rounded-lg border overflow-hidden">
              <div className="px-3 py-2 bg-muted/40 border-b">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {products.length} product{products.length !== 1 ? "s" : ""} to
                  import
                </span>
              </div>
              <ScrollArea className="max-h-48">
                <div className="divide-y">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 px-3 py-2"
                    >
                      {p.bigImage ? (
                        <img
                          src={p.bigImage}
                          alt=""
                          className="w-8 h-8 rounded object-cover bg-muted shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                          <Package className="h-3 w-3 text-muted-foreground" />
                        </div>
                      )}
                      <span className="text-xs flex-1 min-w-0 truncate leading-tight">
                        {p.nameEn}
                      </span>
                      {p.sellPrice && (
                        <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                          ${parseFloat(p.sellPrice).toFixed(2)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Markup */}
            <div className="space-y-1.5">
              <Label
                htmlFor="multi-markup"
                className="text-xs font-medium flex items-center gap-1.5"
              >
                <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                Markup (% above CJ cost)
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="multi-markup"
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
                Each product will be imported with its base price. Open
                individual products to import specific variants.
              </p>
            </div>

            <Separator />

            {/* Make active toggle */}
            <div className="flex items-center gap-3">
              <Switch
                id="multi-makeActive"
                checked={makeActive}
                onCheckedChange={setMakeActive}
                disabled={status === "loading"}
              />
              <Label
                htmlFor="multi-makeActive"
                className="text-sm cursor-pointer"
              >
                Publish immediately
                <span className="block text-xs text-muted-foreground font-normal">
                  Off = imported as Draft
                </span>
              </Label>
            </div>

            {/* Fatal error */}
            {fatalError && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{fatalError}</span>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="gap-2 pt-2">
          {status === "done" ? (
            <Button onClick={handleClose} className="w-full">
              <X className="h-4 w-4 mr-1.5" />
              Close
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={status === "loading"}
              >
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                disabled={status === "loading" || products.length === 0}
              >
                {status === "loading" ? (
                  <>
                    <span className="h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Importing…
                  </>
                ) : (
                  `Import ${products.length} product${products.length !== 1 ? "s" : ""}`
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
