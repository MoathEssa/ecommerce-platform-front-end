import { useState } from "react";
import { Plus, Pencil, PowerOff, Package, TrendingDown } from "lucide-react";

import {
  useAdminAddVariantMutation,
  useAdminUpdateVariantMutation,
  useAdminDeactivateVariantMutation,
} from "@features/catalog/api/catalogApi";
import type { AdminProductVariantDto } from "../types";
import type { VariantFormValues } from "../schemas/productSchemas";
import VariantFormDialog from "./VariantFormDialog";

import { Button } from "@shared/ui/button";
import { Badge } from "@shared/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@shared/ui/alert-dialog";
import { cn } from "@shared/lib/utils";
import { extractApiError } from "@shared/lib/utils";

// ── Helper ────────────────────────────────────────────────────────────────────

function optionBadges(options: Record<string, string>) {
  return Object.entries(options).map(([k, v]) => `${k}: ${v}`);
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface ProductVariantsPanelProps {
  productId: number;
  variants: AdminProductVariantDto[];
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ProductVariantsPanel({
  productId,
  variants,
}: ProductVariantsPanelProps) {
  const [addVariant, { isLoading: isAdding }] = useAdminAddVariantMutation();
  const [updateVariant, { isLoading: isUpdating }] =
    useAdminUpdateVariantMutation();
  const [deactivateVariant] = useAdminDeactivateVariantMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVariant, setEditingVariant] =
    useState<AdminProductVariantDto | null>(null);
  const [deactivateTarget, setDeactivateTarget] =
    useState<AdminProductVariantDto | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  function openAdd() {
    setEditingVariant(null);
    setApiError(null);
    setDialogOpen(true);
  }

  function openEdit(variant: AdminProductVariantDto) {
    setEditingVariant(variant);
    setApiError(null);
    setDialogOpen(true);
  }

  async function handleSubmit(values: VariantFormValues) {
    setApiError(null);
    // Convert options array → dict
    const optionsDict = Object.fromEntries(
      values.options.map(({ key, value }) => [key, value]),
    );

    try {
      if (editingVariant) {
        await updateVariant({
          productId,
          variantId: editingVariant.id,
          sku: editingVariant.sku,
          options: optionsDict,
          basePrice: values.basePrice,
          currencyCode: values.currencyCode,
          isActive: values.isActive,
        }).unwrap();
      } else {
        await addVariant({
          productId,
          options: optionsDict,
          basePrice: values.basePrice,
          currencyCode: values.currencyCode,
          isActive: values.isActive,
          initialStock: values.initialStock,
        }).unwrap();
      }
    } catch (err) {
      setApiError(extractApiError(err));
      throw err; // keep dialog open on error
    }
  }

  async function handleDeactivate() {
    if (!deactivateTarget) return;
    try {
      await deactivateVariant({
        productId,
        variantId: deactivateTarget.id,
      }).unwrap();
    } catch {
      /* silent — list will reflect actual state */
    } finally {
      setDeactivateTarget(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {variants.length} variant{variants.length !== 1 ? "s" : ""} total
        </p>
        <Button type="button" size="sm" onClick={openAdd}>
          <Plus className="mr-2 h-3.5 w-3.5" />
          Add Variant
        </Button>
      </div>

      {/* Empty state */}
      {variants.length === 0 && (
        <div className="rounded-lg border border-dashed p-8 text-center space-y-2">
          <Package className="mx-auto h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No variants yet.</p>
          <p className="text-xs text-muted-foreground">
            Add at least one variant with options, price and stock.
          </p>
        </div>
      )}

      {/* Variant cards */}
      {variants.map((v) => {
        const inv = v.inventory;
        const isLowStock = inv.available > 0 && inv.available <= 5;
        const isOutOfStock = inv.available === 0;

        return (
          <div
            key={v.id}
            className={cn(
              "rounded-lg border p-4 space-y-3 transition-opacity",
              !v.isActive && "opacity-60",
            )}
          >
            {/* Top row: options + status */}
            <div className="flex items-start gap-2 flex-wrap">
              {optionBadges(v.options).map((label) => (
                <Badge key={label} variant="secondary" className="text-xs">
                  {label}
                </Badge>
              ))}
              {!v.isActive && (
                <Badge
                  variant="outline"
                  className="text-xs text-muted-foreground ml-auto"
                >
                  Inactive
                </Badge>
              )}
            </div>

            {/* Middle: price + inventory */}
            <div className="flex items-center gap-6 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Price</p>
                <p className="font-semibold tabular-nums">
                  {v.basePrice.toFixed(2)}{" "}
                  <span className="text-xs text-muted-foreground font-normal">
                    {v.currencyCode}
                  </span>
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">On‑hand</p>
                <p className="font-medium tabular-nums">{inv.onHand}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Available</p>
                <p
                  className={cn(
                    "font-medium tabular-nums",
                    isOutOfStock && "text-destructive",
                    isLowStock && "text-amber-600",
                  )}
                >
                  {inv.available}
                </p>
              </div>

              {isLowStock && (
                <TrendingDown className="h-4 w-4 text-amber-500 ml-auto" />
              )}
              {isOutOfStock && (
                <span className="text-xs font-medium text-destructive ml-auto">
                  Out of stock
                </span>
              )}
            </div>

            {/* SKU + actions */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-mono">
                SKU: {v.sku}
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => openEdit(v)}
                >
                  <Pencil className="mr-2 h-3 w-3" />
                  Edit
                </Button>
                {v.isActive && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => setDeactivateTarget(v)}
                  >
                    <PowerOff className="mr-2 h-3 w-3" />
                    Deactivate
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {apiError && <p className="text-sm text-destructive">{apiError}</p>}

      {/* Dialogs */}
      <VariantFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        variant={editingVariant}
        isSaving={isAdding || isUpdating}
        onSubmit={handleSubmit}
      />

      <AlertDialog
        open={!!deactivateTarget}
        onOpenChange={(open) => !open && setDeactivateTarget(null)}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate variant?</AlertDialogTitle>
            <AlertDialogDescription>
              This variant will no longer be available on the storefront. You
              can re-activate it by editing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivate}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
