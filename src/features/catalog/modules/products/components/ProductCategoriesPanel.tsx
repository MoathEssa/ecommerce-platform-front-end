import { useState, useMemo } from "react";
import { Loader2, Tag, X } from "lucide-react";

import {
  useAdminGetCategoriesQuery,
  useAdminSetProductCategoriesMutation,
} from "@features/catalog/api/catalogApi";
import {
  adminFlatToTree,
  flattenTree,
} from "@features/catalog/modules/categories/utils/categoryUtils";
import type { ProductCategoryDto } from "../types";

import { Button } from "@shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/select";
import { extractApiError } from "@shared/lib/utils";

// ── Props ─────────────────────────────────────────────────────────────────────

interface ProductCategoriesPanelProps {
  productId: number;
  /** Current category from the product detail (null when uncategorised) */
  currentCategory?: ProductCategoryDto | null;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ProductCategoriesPanel({
  productId,
  currentCategory,
}: ProductCategoriesPanelProps) {
  const { data: adminCats = [] } = useAdminGetCategoriesQuery();
  const [setCategory, { isLoading }] = useAdminSetProductCategoriesMutation();

  const [selectedId, setSelectedId] = useState<string>(
    currentCategory ? String(currentCategory.id) : "",
  );
  const [apiError, setApiError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const flatCategories = useMemo(
    () => flattenTree(adminFlatToTree(adminCats)),
    [adminCats],
  );

  async function handleSave() {
    setApiError(null);
    try {
      const categoryId = selectedId ? Number(selectedId) : null;
      await setCategory({ productId, categoryId }).unwrap();
      setSaved(true);
    } catch (err) {
      setApiError(extractApiError(err));
    }
  }

  return (
    <div className="space-y-5">
      {/* Current assignment */}
      {selectedId ? (
        <div className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/5 p-3">
          <Tag className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="flex-1 text-sm font-medium truncate">
            {flatCategories.find((c) => c.id === Number(selectedId))?.name ??
              `#${selectedId}`}
          </span>
          <button
            type="button"
            title="Remove category"
            onClick={() => {
              setSelectedId("");
              setSaved(false);
            }}
            className="shrink-0 text-muted-foreground hover:text-destructive transition-colors ml-1"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground py-6 text-center border rounded-lg">
          No category assigned yet.
        </p>
      )}

      {/* Category selector */}
      <Select
        value={selectedId}
        onValueChange={(v) => {
          setSelectedId(v);
          setSaved(false);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a category…" />
        </SelectTrigger>
        <SelectContent>
          {flatCategories.map((c) => (
            <SelectItem key={c.id} value={String(c.id)}>
              {"  ".repeat(c.depth)}
              {c.depth > 0 ? "└ " : ""}
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {apiError && <p className="text-sm text-destructive">{apiError}</p>}

      <div className="flex items-center justify-between pt-1">
        {saved && (
          <span className="text-xs text-green-600 font-medium">
            Saved successfully
          </span>
        )}
        <div className="ml-auto">
          <Button type="button" onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Category
          </Button>
        </div>
      </div>
    </div>
  );
}
