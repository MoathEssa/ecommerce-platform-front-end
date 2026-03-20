import { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Loader2,
  FolderTree,
} from "lucide-react";

import { useAdminImportCjCategoryMutation } from "@features/catalog/api/catalogApi";
import type {
  CjCategoryNodeDto,
  CjImportCategoryPayload,
  ImportCjSubtreeItem,
} from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@shared/ui/dialog";
import { Button } from "@shared/ui/button";
import { Checkbox } from "@shared/ui/checkbox";
import { Label } from "@shared/ui/label";
import { Separator } from "@shared/ui/separator";
import { Switch } from "@shared/ui/switch";

// ── Types ─────────────────────────────────────────────────────────────────────

export type { CjImportCategoryPayload };

interface CjImportCategoryDialogProps {
  payload: CjImportCategoryPayload | null;
  open: boolean;
  onClose: () => void;
}

type Status = "idle" | "loading" | "success" | "error";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Recursively maps CjCategoryNodeDto children to the API's ImportCjSubtreeItem shape. */
function mapToSubtreeItems(nodes: CjCategoryNodeDto[]): ImportCjSubtreeItem[] {
  return nodes
    .filter((n) => n.categoryId != null)
    .map((n) => ({
      id: n.categoryId!,
      name: n.name,
      children: mapToSubtreeItems(n.children),
    }));
}

/** Returns { l2, l3 } counts for an L1 subtreeChildren array (each child is L2 with L3 children). */
function countL1Subtree(children: CjCategoryNodeDto[]): {
  l2: number;
  l3: number;
} {
  const l2 = children.length;
  const l3 = children.reduce((s, c) => s + c.children.length, 0);
  return { l2, l3 };
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CjImportCategoryDialog({
  payload,
  open,
  onClose,
}: CjImportCategoryDialogProps) {
  const [includeChain, setIncludeChain] = useState(true);
  const [makeActive, setMakeActive] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [importCjCategory] = useAdminImportCjCategoryMutation();

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen && status !== "loading") {
      handleClose();
    }
  }

  function handleClose() {
    // Reset state when dialog closes
    setStatus("idle");
    setErrorMessage("");
    setIncludeChain(true);
    setMakeActive(false);
    onClose();
  }

  async function handleImport() {
    if (!payload) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const level = payload.targetLevel ?? 3;
      const subTree =
        payload.subtreeChildren && payload.subtreeChildren.length > 0
          ? mapToSubtreeItems(payload.subtreeChildren)
          : null;

      await importCjCategory({
        leafId: payload.leafId,
        leafName: payload.leafName,
        level1Id: level >= 2 ? payload.level1Id : null,
        level1Name: level >= 2 ? payload.level1Name : "",
        level2Id: level === 3 ? payload.level2Id : null,
        level2Name: level === 3 ? payload.level2Name : "",
        includeChain: level > 1 ? includeChain : false,
        subTree,
        targetLevel: level,
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

  // ── Pre-computed subtree counts (avoids complex inline JSX expressions) ──
  const level = payload.targetLevel ?? 3;
  const sub = payload.subtreeChildren ?? [];
  const l1Counts = level === 1 ? countL1Subtree(sub) : null;
  const l2L3Count = level === 2 ? sub.length : 0;
  const subtreeSummary =
    level === 1 && l1Counts
      ? `${l1Counts.l2} sub-categor${l1Counts.l2 === 1 ? "y" : "ies"} and ${l1Counts.l3} leaf categor${l1Counts.l3 === 1 ? "y" : "ies"} underneath`
      : level === 2
        ? `${l2L3Count} leaf categor${l2L3Count === 1 ? "y" : "ies"} underneath`
        : "";
  const successDetail =
    level === 1 && l1Counts
      ? `Imported ${payload.leafName} with ${l1Counts.l2} sub-categor${l1Counts.l2 === 1 ? "y" : "ies"} and ${l1Counts.l3} leaf categor${l1Counts.l3 === 1 ? "y" : "ies"} (${1 + l1Counts.l2 + l1Counts.l3} total).`
      : level === 2
        ? `Imported ${payload.leafName} with ${l2L3Count} leaf categor${l2L3Count === 1 ? "y" : "ies"} (${1 + l2L3Count + (includeChain ? 1 : 0)} total).`
        : includeChain
          ? `Created 3 categories: ${payload.level1Name} → ${payload.level2Name} → ${payload.leafName}.`
          : `Created category: ${payload.leafName}`;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import category to store</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Category path */}
          <div className="rounded-lg border bg-muted/30 px-4 py-3">
            <p className="text-xs text-muted-foreground mb-1.5 font-medium uppercase tracking-wide">
              Category path
            </p>
            <div className="flex items-center gap-1.5 flex-wrap text-sm">
              {payload.targetLevel === 1 && (
                <span className="font-semibold text-primary">
                  {payload.leafName}
                </span>
              )}
              {payload.targetLevel === 2 && (
                <>
                  <span className="font-medium">{payload.level1Name}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="font-semibold text-primary">
                    {payload.leafName}
                  </span>
                </>
              )}
              {(payload.targetLevel === 3 || payload.targetLevel == null) && (
                <>
                  <span className="font-medium">{payload.level1Name}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="font-medium">{payload.level2Name}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="font-semibold text-primary">
                    {payload.leafName}
                  </span>
                </>
              )}
            </div>
          </div>

          <Separator />

          {/* Subtree summary — shown for L1 and L2 imports */}
          {level !== 3 && sub.length > 0 && (
            <div className="flex items-start gap-2.5 rounded-lg border bg-muted/40 px-4 py-3">
              <FolderTree className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Will also import
                </p>
                <p className="text-sm">{subtreeSummary}</p>
              </div>
            </div>
          )}

          {/* Publish immediately toggle */}
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="cat-make-active" className="text-sm font-medium">
                Publish immediately
              </Label>
              <p className="text-xs text-muted-foreground">
                Make the{" "}
                {payload.targetLevel === 1 || !includeChain
                  ? "category"
                  : "categories"}{" "}
                visible in the store right away. Leave off to save as draft
                first.
              </p>
            </div>
            <Switch
              id="cat-make-active"
              checked={makeActive}
              onCheckedChange={setMakeActive}
              disabled={status === "loading" || status === "success"}
            />
          </div>

          {/* Include chain option — only relevant for L2 and L3 */}
          {payload.targetLevel !== 1 && (
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="include-chain"
                  checked={includeChain}
                  onCheckedChange={(v) => setIncludeChain(Boolean(v))}
                  disabled={status === "loading" || status === "success"}
                  className="mt-0.5"
                />
                <div className="space-y-1">
                  <Label
                    htmlFor="include-chain"
                    className="text-sm cursor-pointer font-medium"
                  >
                    Include full category chain
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {payload.targetLevel === 2 ? (
                      <>
                        Also create{" "}
                        <span className="font-medium text-foreground">
                          {payload.level1Name}
                        </span>{" "}
                        as parent category in your store.
                      </>
                    ) : (
                      <>
                        Also create{" "}
                        <span className="font-medium text-foreground">
                          {payload.level1Name}
                        </span>{" "}
                        and{" "}
                        <span className="font-medium text-foreground">
                          {payload.level2Name}
                        </span>{" "}
                        as parent categories in your store.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Success state */}
          {status === "success" && (
            <div className="flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
              <div className="space-y-0.5">
                <p className="text-sm font-medium">
                  Category imported successfully!
                </p>
                <p className="text-xs opacity-80">
                  {successDetail}{" "}
                  {makeActive
                    ? "Now visible in your store."
                    : "Saved as draft — publish from the categories page."}
                </p>
              </div>
            </div>
          )}

          {/* Error state */}
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
