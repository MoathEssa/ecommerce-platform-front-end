import { useState } from "react";
import { Download, Package, AlertCircle, CheckSquare } from "lucide-react";

import { useAdminGetCjProductVariantsQuery } from "@features/catalog/api/catalogApi";
import type { CjProductListItemDto, CjProductVariantDto } from "../types";
import type { CjImportVariantPayload } from "./CjImportVariantDialog";
import { CjImportVariantDialog } from "./CjImportVariantDialog";
import type { CjBulkImportVariantsPayload } from "./CjBulkImportVariantsDialog";
import { CjBulkImportVariantsDialog } from "./CjBulkImportVariantsDialog";
import { Button } from "@shared/ui/button";
import { Badge } from "@shared/ui/badge";
import { Checkbox } from "@shared/ui/checkbox";
import { Skeleton } from "@shared/ui/skeleton";

// ── Props ─────────────────────────────────────────────────────────────────────

interface CjVariantPanelProps {
  product: CjProductListItemDto;
  colSpan: number;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CjVariantPanel({ product, colSpan }: CjVariantPanelProps) {
  const [importPayload, setImportPayload] =
    useState<CjImportVariantPayload | null>(null);
  const [bulkPayload, setBulkPayload] =
    useState<CjBulkImportVariantsPayload | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const {
    data: variants,
    isLoading,
    isError,
  } = useAdminGetCjProductVariantsQuery({ pid: product.id });

  function handleImportClick(variant: CjProductVariantDto) {
    setImportPayload({ variant, product });
  }

  function toggleSelect(vid: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(vid)) next.delete(vid);
      else next.add(vid);
      return next;
    });
  }

  function toggleSelectAll() {
    if (!variants) return;
    if (selectedIds.size === variants.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(variants.map((v) => v.vid)));
    }
  }

  function openBulkImport() {
    if (!variants) return;
    const selected = variants.filter((v) => selectedIds.has(v.vid));
    if (selected.length === 0) return;
    setBulkPayload({ variants: selected, product });
  }

  const allSelected =
    !!variants && variants.length > 0 && selectedIds.size === variants.length;
  const someSelected = selectedIds.size > 0;

  return (
    <>
      <td colSpan={colSpan} className="p-0">
        <div className="bg-muted/20 border-t border-dashed">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-2 border-b bg-muted/40">
            <Package className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Variants — {product.nameEn}
            </span>

            {/* Bulk action bar — shown when variants are loaded and at least 1 row exists */}
            {!isLoading && !isError && variants && variants.length > 0 && (
              <div className="ml-auto flex items-center gap-2">
                <Checkbox
                  id={`selectAll-${product.id}`}
                  checked={allSelected}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all variants"
                />
                <label
                  htmlFor={`selectAll-${product.id}`}
                  className="text-xs text-muted-foreground cursor-pointer select-none"
                >
                  All
                </label>
                {someSelected && (
                  <Button
                    size="sm"
                    className="h-7 gap-1.5 text-xs"
                    onClick={openBulkImport}
                  >
                    <CheckSquare className="h-3 w-3" />
                    Import {selectedIds.size} selected
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="p-4 space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded" />
                  <Skeleton className="h-4 flex-1 rounded" />
                  <Skeleton className="h-4 w-20 rounded" />
                  <Skeleton className="h-7 w-16 rounded" />
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="flex items-center gap-2 px-4 py-3 text-destructive text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              Failed to load variants. Check your CJ credentials and try again.
            </div>
          )}

          {/* Empty */}
          {!isLoading && !isError && variants?.length === 0 && (
            <p className="px-4 py-3 text-sm text-muted-foreground">
              No variants found for this product.
            </p>
          )}

          {/* Variant rows */}
          {!isLoading && !isError && variants && variants.length > 0 && (
            <div className="divide-y">
              {variants.map((v) => {
                const price =
                  v.variantSellPrice != null
                    ? `$${v.variantSellPrice.toFixed(2)}`
                    : null;
                const suggestedPrice =
                  v.variantSugSellPrice != null
                    ? `$${v.variantSugSellPrice.toFixed(2)}`
                    : null;
                const displayName =
                  v.variantNameEn?.trim() ||
                  [v.variantKey, v.variantSku].filter(Boolean).join(" — ");

                return (
                  <div
                    key={v.vid}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors"
                  >
                    {/* Row checkbox */}
                    <Checkbox
                      checked={selectedIds.has(v.vid)}
                      onCheckedChange={() => toggleSelect(v.vid)}
                      aria-label={`Select ${displayName}`}
                      className="shrink-0"
                    />

                    {/* Image */}
                    {v.variantImage ? (
                      <img
                        src={v.variantImage}
                        alt=""
                        className="w-10 h-10 rounded object-cover bg-muted shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded bg-muted flex items-center justify-center shrink-0">
                        <Package className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    )}

                    {/* Name + options */}
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <p className="text-sm font-medium line-clamp-1">
                        {displayName}
                      </p>
                      {v.variantKey && (
                        <div className="flex flex-wrap gap-1">
                          {v.variantKey.split("-").map((opt) => (
                            <Badge
                              key={opt}
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 h-4"
                            >
                              {opt.trim()}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* SKU */}
                    {v.variantSku && (
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded hidden md:block max-w-36 truncate shrink-0">
                        {v.variantSku}
                      </code>
                    )}

                    {/* Price */}
                    <div className="text-right shrink-0 min-w-[70px]">
                      {price && (
                        <span className="text-sm font-semibold tabular-nums">
                          {price}
                        </span>
                      )}
                      {suggestedPrice && suggestedPrice !== price && (
                        <p className="text-[10px] text-muted-foreground">
                          sugg. {suggestedPrice}
                        </p>
                      )}
                    </div>

                    {/* Weight */}
                    {v.variantWeight != null && (
                      <span className="text-xs text-muted-foreground shrink-0 hidden lg:block">
                        {v.variantWeight}g
                      </span>
                    )}

                    {/* Import button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 gap-1.5 text-xs shrink-0"
                      onClick={() => handleImportClick(v)}
                    >
                      <Download className="h-3 w-3" />
                      Import
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </td>

      <CjImportVariantDialog
        payload={importPayload}
        open={importPayload !== null}
        onClose={() => setImportPayload(null)}
      />

      <CjBulkImportVariantsDialog
        payload={bulkPayload}
        open={bulkPayload !== null}
        onClose={() => {
          setBulkPayload(null);
          setSelectedIds(new Set());
        }}
      />
    </>
  );
}
