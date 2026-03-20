import { useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, AlertCircle, PackagePlus } from "lucide-react";

import {
  useAdminGetProductByIdQuery,
  useAdminCreateProductMutation,
  useAdminUpdateProductMutation,
  useAdminImportCjProductMutation,
} from "@features/catalog/api/catalogApi";
import {
  productFormSchema,
  type ProductFormValues,
  type ProductFormInput,
} from "@features/catalog/modules/products/schemas/productSchemas";
import type { CjProductListItemDto } from "@features/catalog/modules/suppliers/types";
import ProductFormPanel from "@features/catalog/modules/products/components/ProductFormPanel";
import ProductCategoriesPanel from "@features/catalog/modules/products/components/ProductCategoriesPanel";
import ProductVariantsPanel from "@features/catalog/modules/products/components/ProductVariantsPanel";
import ProductImagesPanel from "@features/catalog/modules/products/components/ProductImagesPanel";
import ProductStatusBadge from "@features/catalog/modules/products/components/ProductStatusBadge";

import { Button } from "@shared/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@shared/ui/tabs";
import { Skeleton } from "@shared/ui/skeleton";
import { extractApiError } from "@shared/lib/utils";

// ── Slug helper ───────────────────────────────────────────────────────────────

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function SaveProductPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: idParam } = useParams<{ id: string }>();
  const productId = idParam ? Number(idParam) : null;
  const isEdit = productId !== null;

  // CJ import mode: populated when navigating from CjProductsPage
  const fromCj = location.state?.fromCj as CjProductListItemDto | undefined;

  // ── Data ───────────────────────────────────────────────────────────────────

  const {
    data: product,
    isLoading: productLoading,
    error: productError,
  } = useAdminGetProductByIdQuery(productId!, { skip: !isEdit });

  const [createProduct, { isLoading: isCreating, error: createError }] =
    useAdminCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating, error: updateError }] =
    useAdminUpdateProductMutation();
  const [importCjProduct, { isLoading: isImporting, error: importError }] =
    useAdminImportCjProductMutation();

  const isSaving = isCreating || isUpdating || isImporting;
  const apiError =
    extractApiError(createError, "") ||
    extractApiError(updateError, "") ||
    extractApiError(importError, "") ||
    "";

  // ── Form ───────────────────────────────────────────────────────────────────

  const form = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues:
      fromCj && !isEdit
        ? {
            title: fromCj.nameEn,
            slug: toSlug(fromCj.nameEn),
            description: "",
            brand: fromCj.supplierName ?? "",
          }
        : { title: "", slug: "", description: "", brand: "" },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        title: product.title,
        slug: product.slug,
        description: product.description ?? "",
        brand: product.brand ?? "",
      });
    }
  }, [product, form]);

  function handleTitleBlur(title: string) {
    const current = form.getValues("slug");
    if (!current || current === toSlug(form.getValues("title"))) {
      form.setValue("slug", toSlug(title), { shouldValidate: true });
    }
  }

  async function handleSubmit(values: ProductFormValues) {
    if (isEdit) {
      await updateProduct({ id: productId!, ...values }).unwrap();
    } else if (fromCj) {
      // Import from CJ: backend creates product with ExternalProductId + Supplier
      const result = await importCjProduct({
        cjProductId: fromCj.id,
        nameEn: values.title,
        sku: fromCj.sku,
        imageUrl: fromCj.bigImage,
        sellPrice: fromCj.sellPrice,
        cjCategoryId: fromCj.categoryId,
        oneCategoryName: fromCj.oneCategoryName,
        twoCategoryName: fromCj.twoCategoryName,
        threeCategoryName: fromCj.threeCategoryName,
      }).unwrap();
      // result.data is the new product ID (number)
      navigate(`/catalog/products/${result.data}/edit`, { replace: true });
    } else {
      const result = await createProduct(values).unwrap();
      navigate(`/catalog/products/${result.data.id}/edit`, { replace: true });
    }
  }

  // ── Tab lock: other tabs only available after product exists ───────────────

  const otherTabsDisabled = !isEdit;
  const tabHint = !isEdit
    ? "Save the product first to manage categories, variants and images."
    : "";

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => navigate("/catalog/products")}
          className="mt-0.5"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold truncate">
              {isEdit
                ? productLoading
                  ? "Loading…"
                  : (product?.title ?? "Product")
                : fromCj
                  ? "Import from CJ"
                  : "New Product"}
            </h1>
            {product && <ProductStatusBadge status={product.status} />}
          </div>
          {isEdit && product && (
            <p className="text-sm text-muted-foreground mt-0.5 font-mono">
              /{product.slug}
            </p>
          )}
        </div>
      </div>

      {/* CJ import mode banner */}
      {fromCj && !isEdit && (
        <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/40 px-4 py-3 text-sm">
          <PackagePlus className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
          <div className="min-w-0">
            <span className="font-medium text-blue-900 dark:text-blue-300">
              Importing from CJ Dropshipping
            </span>
            <span className="text-blue-700 dark:text-blue-400 ml-2 truncate">
              {fromCj.nameEn}
            </span>
          </div>
        </div>
      )}

      {/* Main error */}
      {productError && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Could not load product. Please go back and try again.
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="info">
        <TabsList className="mb-6">
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="categories" disabled={otherTabsDisabled}>
            Categories
          </TabsTrigger>
          <TabsTrigger value="variants" disabled={otherTabsDisabled}>
            Variants
          </TabsTrigger>
          <TabsTrigger value="images" disabled={otherTabsDisabled}>
            Images
          </TabsTrigger>
        </TabsList>

        {/* Hint when tabs are locked */}
        {otherTabsDisabled && (
          <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-4 py-3 text-sm text-muted-foreground mb-4">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {tabHint}
          </div>
        )}

        {/* ── Info tab ───────────────────────────────────────────────────── */}
        <TabsContent value="info">
          <div className="max-w-xl">
            {apiError && (
              <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {apiError}
              </div>
            )}
            <ProductFormPanel
              form={form}
              isLoading={productLoading}
              isSaving={isSaving}
              onTitleBlur={handleTitleBlur}
              onSubmit={handleSubmit}
            />
          </div>
        </TabsContent>

        {/* ── Categories tab ─────────────────────────────────────────────── */}
        <TabsContent value="categories">
          <div className="max-w-xl">
            {isEdit && product ? (
              <ProductCategoriesPanel
                productId={productId!}
                currentCategory={product.category}
              />
            ) : (
              <CategoryTabSkeleton />
            )}
          </div>
        </TabsContent>

        {/* ── Variants tab ───────────────────────────────────────────────── */}
        <TabsContent value="variants">
          {isEdit && product ? (
            <ProductVariantsPanel
              productId={productId!}
              variants={product.variants}
            />
          ) : (
            <VariantsTabSkeleton />
          )}
        </TabsContent>

        {/* ── Images tab ─────────────────────────────────────────────────── */}
        <TabsContent value="images">
          {isEdit && productId ? (
            <ProductImagesPanel productId={productId} />
          ) : (
            <ImagesTabSkeleton />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ── Skeleton placeholders ─────────────────────────────────────────────────────

function CategoryTabSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  );
}

function VariantsTabSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2].map((i) => (
        <Skeleton key={i} className="h-28 w-full rounded-lg" />
      ))}
    </div>
  );
}

function ImagesTabSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="aspect-square rounded-lg" />
      ))}
    </div>
  );
}
