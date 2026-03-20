import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layers, List, Settings2 } from "lucide-react";

import { useMemo } from "react";
import { useAdminGetCategoriesQuery } from "@features/catalog/api/catalogApi";
import { adminFlatToTree } from "@features/catalog/modules/categories/utils/categoryUtils";
import {
  CategoriesTable,
  CategoryDeleteDialog,
  CategoryDetailDialog,
} from "@features/catalog/modules/categories";
import type { FlatCategory } from "@features/catalog/modules/categories";
import type { CategoryTreeDto } from "@features/catalog/modules/categories";

import { Button } from "@shared/ui/button";

export default function CategoryListPage() {
  const navigate = useNavigate();
  const { data: adminCats = [] } = useAdminGetCategoriesQuery();
  const tree = useMemo(() => adminFlatToTree(adminCats), [adminCats]);

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<FlatCategory | null>(
    null,
  );
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [hierarchy, setHierarchy] = useState(true);

  function openDetails(category: FlatCategory) {
    setSelectedCategory(category);
    setDetailOpen(true);
  }

  function openDelete(category: FlatCategory) {
    setSelectedCategory(category);
    setDeleteOpen(true);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your product categories and hierarchy.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={hierarchy ? "secondary" : "ghost"}
            size="icon-sm"
            title="Tree view"
            onClick={() => setHierarchy(true)}
          >
            <Layers className="h-4 w-4" />
          </Button>
          <Button
            variant={!hierarchy ? "secondary" : "ghost"}
            size="icon-sm"
            title="Flat view"
            onClick={() => setHierarchy(false)}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button onClick={() => navigate("/catalog/categories/manage")}>
            <Settings2 className="h-4 w-4" />
            Manage Categories
          </Button>
        </div>
      </div>

      {/* Table */}
      <CategoriesTable
        hierarchy={hierarchy}
        onViewDetails={openDetails}
        onDelete={openDelete}
      />

      {/* Detail dialog */}
      <CategoryDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        category={selectedCategory}
        tree={tree as CategoryTreeDto[]}
      />

      {/* Delete dialog */}
      <CategoryDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        category={selectedCategory}
      />
    </div>
  );
}
