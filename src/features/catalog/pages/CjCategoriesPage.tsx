import { useState } from "react";

import { useAdminGetCjCategoriesQuery } from "@features/catalog/api/catalogApi";
import {
  CjCategoryTree,
  CjImportCategoryDialog,
} from "@features/catalog/modules/suppliers/components";
import type { CjImportCategoryPayload } from "@features/catalog/modules/suppliers/types";

export default function CjCategoriesPage() {
  const {
    data: tree = [],
    isLoading,
    isError,
  } = useAdminGetCjCategoriesQuery();

  const [importPayload, setImportPayload] =
    useState<CjImportCategoryPayload | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">CJ Supplier Categories</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Browse the 3-level CJ category hierarchy. Expand a section then click{" "}
          <strong>Import</strong> on any leaf category to create a matching
          store category.
        </p>
      </div>

      <CjCategoryTree
        tree={tree}
        isLoading={isLoading}
        isError={isError}
        onImport={setImportPayload}
      />

      <CjImportCategoryDialog
        payload={importPayload}
        open={importPayload !== null}
        onClose={() => setImportPayload(null)}
      />
    </div>
  );
}
