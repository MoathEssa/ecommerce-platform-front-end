import { useNavigate } from "react-router-dom";
import { Package, Plus } from "lucide-react";

import { ProductsTable } from "@features/catalog/modules/products";

import { Button } from "@shared/ui/button";

export default function ProductListPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Package className="h-6 w-6" />
            Products
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your product catalog, variants and inventory.
          </p>
        </div>
        <Button onClick={() => navigate("/catalog/products/new")}>
          <Plus className="mr-2 h-4 w-4" />
          New Product
        </Button>
      </div>

      {/* Table */}
      <ProductsTable />
    </div>
  );
}
