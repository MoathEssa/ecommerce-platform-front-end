import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

import { useAdminGetCjProductsQuery } from "@features/catalog/api/catalogApi";
import type {
  CjProductListItemDto,
  CjProductSearchParams,
} from "@features/catalog/modules/suppliers/types";
import {
  CjProductFilters,
  CjProductTable,
  CjProductDetailDialog,
} from "@features/catalog/modules/suppliers/components";
import { CjMultiProductImportDialog } from "@features/catalog/modules/suppliers/components/CjMultiProductImportDialog";
import { Button } from "@shared/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ── Defaults ──────────────────────────────────────────────────────────────────

const DEFAULT_PARAMS: CjProductSearchParams = {
  page: 1,
  size: 20,
  sort: "sort_score",
  orderBy: 1,
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CjProductsPage() {
  const [searchParams] = useSearchParams();
  const categoryIdFromQuery = searchParams.get("categoryId") ?? undefined;

  const [params, setParams] = useState<CjProductSearchParams>({
    ...DEFAULT_PARAMS,
    ...(categoryIdFromQuery ? { categoryId: categoryIdFromQuery } : {}),
  });
  const [hasSearched, setHasSearched] = useState(
    Boolean(params.keyWord || categoryIdFromQuery),
  );
  const [selectedProduct, setSelectedProduct] =
    useState<CjProductListItemDto | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [multiImportProducts, setMultiImportProducts] = useState<
    CjProductListItemDto[]
  >([]);

  // ── Data ──────────────────────────────────────────────────────────────────

  const { data, isLoading, isFetching } = useAdminGetCjProductsQuery(params, {
    skip: !hasSearched,
  });

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSearch = useCallback((keyword: string) => {
    setParams((prev) => ({ ...prev, keyWord: keyword || undefined, page: 1 }));
    setHasSearched(true);
  }, []);

  const handleParamChange = useCallback(
    (partial: Partial<CjProductSearchParams>) => {
      setParams((prev) => ({ ...prev, ...partial }));
      setHasSearched(true);
    },
    [],
  );

  // ── Row selection ─────────────────────────────────────────────────────────

  function handleToggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleToggleSelectAll() {
    if (items.every((p) => selectedIds.has(p.id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((p) => p.id)));
    }
  }

  // ── Pagination ────────────────────────────────────────────────────────────

  const currentPage = params.page ?? 1;
  const totalPages = data?.totalPages ?? 1;
  const totalRecords = data?.totalRecords ?? 0;
  const items = data?.items ?? [];

  const startItem = (currentPage - 1) * (params.size ?? 20) + 1;
  const endItem = Math.min(currentPage * (params.size ?? 20), totalRecords);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5 p-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold">CJ Products</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Search CJ Dropshipping products. Click <strong>Variants</strong> on
          any row to see available variants and import them to your store.
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-lg border bg-card p-4">
        <CjProductFilters
          params={params}
          onSearch={handleSearch}
          onParamChange={handleParamChange}
        />
      </div>

      {/* Table */}
      <CjProductTable
        items={items}
        isLoading={isLoading && hasSearched}
        isFetching={isFetching}
        hasSearched={hasSearched}
        onViewDetails={setSelectedProduct}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onToggleSelectAll={handleToggleSelectAll}
        onBulkImport={(products) => setMultiImportProducts(products)}
      />

      {/* Pagination */}
      {hasSearched && totalPages > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3">
          <p className="text-sm text-muted-foreground">
            {totalRecords > 0 ? (
              <>
                Showing{" "}
                <span className="font-medium text-foreground">
                  {startItem}–{endItem}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {totalRecords.toLocaleString()}
                </span>{" "}
                products
              </>
            ) : (
              "No products found"
            )}
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 px-3"
                disabled={currentPage <= 1 || isFetching}
                onClick={() => handleParamChange({ page: currentPage - 1 })}
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </Button>
              <span className="text-sm tabular-nums text-muted-foreground px-2">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 px-3"
                disabled={currentPage >= totalPages || isFetching}
                onClick={() => handleParamChange({ page: currentPage + 1 })}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Detail dialog */}
      <CjProductDetailDialog
        product={selectedProduct}
        open={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Multi-product import dialog */}
      <CjMultiProductImportDialog
        products={multiImportProducts}
        open={multiImportProducts.length > 0}
        onClose={() => {
          setMultiImportProducts([]);
          setSelectedIds(new Set());
        }}
      />
    </div>
  );
}
