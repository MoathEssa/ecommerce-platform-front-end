import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import DOMPurify from "dompurify";
import { Skeleton } from "@shared/ui/skeleton";
import { Badge } from "@shared/ui/badge";
import { Separator } from "@shared/ui/separator";
import { Truck, Shield, RotateCcw, PackageOpen } from "lucide-react";
import { useGetStorefrontProductBySlugQuery } from "../api/storeCatalogApi";
import ProductImageGallery from "../components/product/ProductImageGallery";
import VariantSelector from "../components/product/VariantSelector";
import AddToCartButton from "../components/product/AddToCartButton";
import ProductBreadcrumb from "../components/product/ProductBreadcrumb";
import ProductReviews from "../components/product/ProductReviews";
import { formatPrice } from "../lib/formatPrice";
import type { ProductVariantDto, ProductImageDto } from "../types";

export default function StoreProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useGetStorefrontProductBySlugQuery(
    slug!,
    {
      skip: !slug,
    },
  );

  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariantDto | null>(null);

  const activeVariant = selectedVariant ?? product?.variants[0] ?? null;

  const galleryImages = useMemo<ProductImageDto[]>(() => {
    if (!product) return [];
    const base = product.images;
    if (activeVariant?.variantImage) {
      const alreadyInGallery = base.some(
        (img) => img.url === activeVariant.variantImage,
      );
      if (!alreadyInGallery) {
        return [
          {
            id: -activeVariant.id,
            url: activeVariant.variantImage,
            variantId: activeVariant.id,
            sortOrder: -1,
          },
          ...base,
        ];
      }
    }
    return base;
  }, [product, activeVariant]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Skeleton className="h-5 w-64 mb-8" />
        <div className="grid gap-10 lg:grid-cols-2">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-5">
            <Skeleton className="h-4 w-20 rounded-full" />
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-5">
          <PackageOpen className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <h2 className="text-xl font-semibold">Product not found</h2>
        <Link
          to="/store/products"
          className="mt-3 text-sm text-primary hover:underline"
        >
          Back to products
        </Link>
      </div>
    );
  }

  const isOutOfStock = activeVariant?.stockStatus === "outOfStock";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-8">
        <ProductBreadcrumb
          breadcrumbs={product.breadcrumbs}
          productTitle={product.title}
        />
      </div>

      {/* ── Top: Gallery + Purchase area ─────────────────────────────── */}
      <div className="grid gap-10 lg:grid-cols-2">
        <ProductImageGallery
          key={activeVariant?.id ?? "default"}
          images={galleryImages}
          title={product.title}
        />

        {/* Info + Purchase */}
        <div className="space-y-6">
          {/* Brand + Title */}
          <div>
            {product.brand && (
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">
                {product.brand}
              </p>
            )}
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl leading-tight">
              {product.title}
            </h1>
          </div>

          {/* Price + Stock */}
          {activeVariant && (
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-foreground">
                {formatPrice(
                  activeVariant.basePrice,
                  activeVariant.currencyCode,
                )}
              </span>
              {isOutOfStock ? (
                <Badge variant="secondary" className="text-xs">
                  Out of Stock
                </Badge>
              ) : (
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800 text-xs">
                  In Stock
                </Badge>
              )}
            </div>
          )}

          {/* Short description */}
          {product.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          )}

          <Separator />

          {/* Variant selector */}
          <VariantSelector
            variants={product.variants}
            selectedId={activeVariant?.id ?? null}
            onSelect={setSelectedVariant}
          />

          {/* Add to Cart */}
          <AddToCartButton
            variantId={activeVariant?.id ?? null}
            disabled={isOutOfStock}
          />

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="flex flex-col items-center gap-1.5 rounded-xl border bg-muted/30 p-3 text-center">
              <Truck className="h-5 w-5 text-primary" />
              <span className="text-[10px] font-medium text-muted-foreground leading-tight">
                Free Shipping
                <br />
                Over 200 SAR
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 rounded-xl border bg-muted/30 p-3 text-center">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-[10px] font-medium text-muted-foreground leading-tight">
                Secure
                <br />
                Payment
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 rounded-xl border bg-muted/30 p-3 text-center">
              <RotateCcw className="h-5 w-5 text-primary" />
              <span className="text-[10px] font-medium text-muted-foreground leading-tight">
                Easy
                <br />
                Returns
              </span>
            </div>
          </div>

          {/* Category + Specs */}
          <div className="space-y-4 pt-2">
            {product.category && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Category:</span>
                <Badge variant="secondary" asChild className="rounded-full">
                  <Link
                    to={`/store/products?categorySlug=${product.category.slug}`}
                  >
                    {product.category.name}
                  </Link>
                </Badge>
              </div>
            )}

            {(product.weightGrams || product.material) && (
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                {product.material && (
                  <>
                    <dt className="font-medium text-muted-foreground">
                      Material
                    </dt>
                    <dd className="text-foreground">{product.material}</dd>
                  </>
                )}
                {product.weightGrams && (
                  <>
                    <dt className="font-medium text-muted-foreground">
                      Weight
                    </dt>
                    <dd className="text-foreground">{product.weightGrams} g</dd>
                  </>
                )}
              </dl>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom: HTML description ─────────────────────────────────── */}
      {product.descriptionHtml && (
        <div className="mt-16">
          <Separator className="mb-8" />
          <h2 className="text-xl font-bold text-foreground mb-6">
            Product Description
          </h2>
          <div
            className="prose prose-sm max-w-none text-muted-foreground"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(product.descriptionHtml),
            }}
          />
        </div>
      )}

      {/* ── Customer Reviews ───────────────────────────────────── */}
      <div className="mt-16">
        <Separator className="mb-8" />
        <h2 className="text-xl font-bold text-foreground mb-6">
          Customer Reviews
        </h2>
        <ProductReviews productSlug={product.slug} />
      </div>
    </div>
  );
}
