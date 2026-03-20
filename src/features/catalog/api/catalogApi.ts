import { baseApi } from "@shared/api";
import type { ApiResponse, PaginatedResult } from "@shared/types";
import type {
  CategoryTreeDto,
  AdminCategoryDto,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@features/catalog/modules/categories/types";
import type {
  CjCategoryNodeDto,
  CjProductListResult,
  CjProductSearchParams,
  CjProductVariantDto,
  ImportCjProductRequest,
  ImportCjCategoryRequest,
  BulkImportCjProductsRequest,
  BulkImportResult,
} from "@features/catalog/modules/suppliers/types";
import type {
  AdminProductListItemDto,
  AdminProductDetailDto,
  ProductImageDto,
  CreateProductRequest,
  UpdateProductRequest,
  ChangeProductStatusRequest,
  BulkChangeProductStatusRequest,
  SetProductCategoryRequest,
  AddVariantRequest,
  UpdateVariantRequest,
  AdminProductVariantDto,
} from "@features/catalog/modules/products/types";

export const catalogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Categories: Storefront ────────────────────────────────────────────────

    getCategories: builder.query<CategoryTreeDto[], { flat?: boolean }>({
      query: ({ flat = false }) => `/v1/catalog/categories?flat=${flat}`,
      transformResponse: (response: ApiResponse<CategoryTreeDto[]>) =>
        response.data,
      providesTags: ["Categories"],
    }),

    // ── Categories: Admin queries ─────────────────────────────────────────────

    adminGetCategories: builder.query<AdminCategoryDto[], void>({
      query: () => `/v1/catalog/admin/categories`,
      transformResponse: (response: ApiResponse<AdminCategoryDto[]>) =>
        response.data,
      providesTags: ["Categories"],
    }),

    adminGetCategoryById: builder.query<AdminCategoryDto, number>({
      query: (id) => `/v1/catalog/admin/categories/${id}`,
      transformResponse: (response: ApiResponse<AdminCategoryDto>) =>
        response.data,
      providesTags: (_result, _err, id) => [{ type: "Categories", id }],
    }),

    // ── Categories: Admin mutations ───────────────────────────────────────────

    adminCreateCategory: builder.mutation<
      ApiResponse<AdminCategoryDto>,
      CreateCategoryRequest
    >({
      query: (body) => ({
        url: "/v1/catalog/admin/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Categories"],
    }),

    adminUpdateCategory: builder.mutation<
      ApiResponse<AdminCategoryDto>,
      { id: number } & UpdateCategoryRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/v1/catalog/admin/categories/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Categories"],
    }),

    adminDeleteCategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `/v1/catalog/admin/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),

    // ── Products: Admin queries ───────────────────────────────────────────────

    adminGetProducts: builder.query<
      PaginatedResult<AdminProductListItemDto>,
      {
        page?: number;
        pageSize?: number;
        status?: string;
        search?: string;
        sortBy?: string;
      }
    >({
      query: ({
        page = 1,
        pageSize = 20,
        status,
        search,
        sortBy = "newest",
      }) => {
        const params = new URLSearchParams({
          page: String(page),
          pageSize: String(pageSize),
          sortBy,
        });
        if (status) params.set("status", status);
        if (search) params.set("search", search);
        return `/v1/catalog/admin/products?${params.toString()}`;
      },
      transformResponse: (
        response: ApiResponse<PaginatedResult<AdminProductListItemDto>>,
      ) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: "Products" as const,
                id,
              })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),

    adminGetProductById: builder.query<AdminProductDetailDto, number>({
      query: (id) => `/v1/catalog/admin/products/${id}`,
      transformResponse: (response: ApiResponse<AdminProductDetailDto>) =>
        response.data,
      providesTags: (_result, _err, id) => [{ type: "Products", id }],
    }),

    // ── Products: Admin mutations ─────────────────────────────────────────────

    adminCreateProduct: builder.mutation<
      ApiResponse<{ id: number; title: string; slug: string }>,
      CreateProductRequest
    >({
      query: (body) => ({
        url: "/v1/catalog/admin/products",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),

    adminUpdateProduct: builder.mutation<
      void,
      { id: number } & UpdateProductRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/v1/catalog/admin/products/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _err, { id }) => [{ type: "Products", id }],
    }),

    adminChangeProductStatus: builder.mutation<
      void,
      { id: number } & ChangeProductStatusRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/v1/catalog/admin/products/${id}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "Products", id },
        { type: "Products", id: "LIST" },
      ],
    }),

    adminBulkChangeProductStatus: builder.mutation<
      { data: number },
      BulkChangeProductStatusRequest
    >({
      query: (body) => ({
        url: `/v1/catalog/admin/products/bulk-status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),

    adminSetProductCategories: builder.mutation<
      void,
      { productId: number } & SetProductCategoryRequest
    >({
      query: ({ productId, categoryId }) => ({
        url: `/v1/catalog/admin/products/${productId}/categories`,
        method: "PUT",
        body: { categoryId },
      }),
      invalidatesTags: (_result, _err, { productId }) => [
        { type: "Products", id: productId },
      ],
    }),

    // ── Variants: Admin mutations ─────────────────────────────────────────────

    adminAddVariant: builder.mutation<
      ApiResponse<AdminProductVariantDto>,
      { productId: number } & AddVariantRequest
    >({
      query: ({ productId, ...body }) => ({
        url: `/v1/catalog/admin/products/${productId}/variants`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _err, { productId }) => [
        { type: "Products", id: productId },
      ],
    }),

    adminUpdateVariant: builder.mutation<
      void,
      { productId: number; variantId: number } & UpdateVariantRequest
    >({
      query: ({ productId, variantId, ...body }) => ({
        url: `/v1/catalog/admin/products/${productId}/variants/${variantId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _err, { productId }) => [
        { type: "Products", id: productId },
      ],
    }),

    adminDeactivateVariant: builder.mutation<
      void,
      { productId: number; variantId: number }
    >({
      query: ({ productId, variantId }) => ({
        url: `/v1/catalog/admin/products/${productId}/variants/${variantId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _err, { productId }) => [
        { type: "Products", id: productId },
      ],
    }),

    // ── Images: Admin ─────────────────────────────────────────────────────────

    adminGetProductImages: builder.query<
      ProductImageDto[],
      { productId: number }
    >({
      query: ({ productId }) =>
        `/v1/catalog/admin/products/${productId}/images`,
      transformResponse: (response: ApiResponse<ProductImageDto[]>) =>
        response.data,
      providesTags: (_result, _err, { productId }) => [
        { type: "ProductImages" as const, id: productId },
      ],
    }),

    adminUploadImage: builder.mutation<
      ProductImageDto,
      { productId: number; file: File; variantId?: number | null }
    >({
      query: ({ productId, file, variantId }) => {
        const form = new FormData();
        form.append("image", file);
        if (variantId != null) form.append("variantId", String(variantId));
        return {
          url: `/v1/catalog/admin/products/${productId}/images`,
          method: "POST",
          body: form,
        };
      },
      transformResponse: (response: ApiResponse<ProductImageDto>) =>
        response.data,
      invalidatesTags: (_result, _err, { productId }) => [
        { type: "Products", id: productId },
        { type: "ProductImages" as const, id: productId },
      ],
    }),

    adminReorderImages: builder.mutation<
      void,
      { productId: number; imageIds: number[] }
    >({
      query: ({ productId, imageIds }) => ({
        url: `/v1/catalog/admin/products/${productId}/images/order`,
        method: "PUT",
        body: imageIds,
      }),
      invalidatesTags: (_result, _err, { productId }) => [
        { type: "Products", id: productId },
        { type: "ProductImages" as const, id: productId },
      ],
    }),

    adminDeleteImage: builder.mutation<
      void,
      { productId: number; imageId: number }
    >({
      query: ({ productId, imageId }) => ({
        url: `/v1/catalog/admin/products/${productId}/images/${imageId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _err, { productId }) => [
        { type: "Products", id: productId },
        { type: "ProductImages" as const, id: productId },
      ],
    }),

    adminUploadCategoryImage: builder.mutation<
      string,
      { categoryId: number; file: File }
    >({
      query: ({ categoryId, file }) => {
        const form = new FormData();
        form.append("image", file);
        return {
          url: `/v1/catalog/admin/categories/${categoryId}/image`,
          method: "PUT",
          body: form,
        };
      },
      transformResponse: (response: ApiResponse<string>) => response.data,
      invalidatesTags: ["Categories"],
    }),

    // ── CJ Supplier Categories ────────────────────────────────────────────────

    adminGetCjCategories: builder.query<CjCategoryNodeDto[], void>({
      query: () => "/v1/catalog/admin/suppliers/cj/categories",
      transformResponse: (response: ApiResponse<CjCategoryNodeDto[]>) =>
        response.data,
      providesTags: ["CjCategories"],
    }),

    // ── CJ Supplier Products ──────────────────────────────────────────────────

    adminGetCjProducts: builder.query<
      CjProductListResult,
      CjProductSearchParams
    >({
      query: (params) => {
        const qs = new URLSearchParams();
        if (params.page) qs.set("page", String(params.page));
        if (params.size) qs.set("size", String(params.size));
        if (params.keyWord) qs.set("keyWord", params.keyWord);
        if (params.categoryId) qs.set("categoryId", params.categoryId);
        if (params.countryCode) qs.set("countryCode", params.countryCode);
        if (params.startSellPrice != null)
          qs.set("startSellPrice", String(params.startSellPrice));
        if (params.endSellPrice != null)
          qs.set("endSellPrice", String(params.endSellPrice));
        if (params.addMarkStatus != null)
          qs.set("addMarkStatus", String(params.addMarkStatus));
        if (params.productType != null)
          qs.set("productType", String(params.productType));
        if (params.sort) qs.set("sort", params.sort);
        if (params.orderBy != null) qs.set("orderBy", String(params.orderBy));
        return `/v1/catalog/admin/suppliers/cj/products?${qs.toString()}`;
      },
      transformResponse: (response: ApiResponse<CjProductListResult>) =>
        response.data,
    }),

    adminImportCjCategory: builder.mutation<
      ApiResponse<number>,
      ImportCjCategoryRequest
    >({
      query: (body) => ({
        url: "/v1/catalog/admin/suppliers/cj/categories/import",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Categories", "CjCategories"],
    }),

    adminImportCjProduct: builder.mutation<
      ApiResponse<number>,
      ImportCjProductRequest
    >({
      query: (body) => ({
        url: "/v1/catalog/admin/suppliers/cj/products/import",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),

    adminBulkImportCjProducts: builder.mutation<
      ApiResponse<BulkImportResult>,
      BulkImportCjProductsRequest
    >({
      query: (body) => ({
        url: "/v1/catalog/admin/suppliers/cj/products/bulk-import",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),

    adminGetCjProductVariants: builder.query<
      CjProductVariantDto[],
      { pid: string; countryCode?: string }
    >({
      query: ({ pid, countryCode }) => {
        const qs = new URLSearchParams();
        if (countryCode) qs.set("countryCode", countryCode);
        const suffix = qs.toString() ? `?${qs.toString()}` : "";
        return `/v1/catalog/admin/suppliers/cj/products/${encodeURIComponent(pid)}/variants${suffix}`;
      },
      transformResponse: (response: ApiResponse<CjProductVariantDto[]>) =>
        response.data,
    }),
  }),
});

export const {
  // Categories
  useGetCategoriesQuery,
  useAdminGetCategoriesQuery,
  useAdminGetCategoryByIdQuery,
  useAdminCreateCategoryMutation,
  useAdminUpdateCategoryMutation,
  useAdminDeleteCategoryMutation,
  useAdminUploadCategoryImageMutation,
  // CJ Supplier
  useAdminGetCjCategoriesQuery,
  useAdminGetCjProductsQuery,
  useAdminImportCjCategoryMutation,
  useAdminImportCjProductMutation,
  useAdminBulkImportCjProductsMutation,
  useAdminGetCjProductVariantsQuery,
  useLazyAdminGetCjProductVariantsQuery,
  // Products
  useAdminGetProductsQuery,
  useAdminGetProductByIdQuery,
  useAdminCreateProductMutation,
  useAdminUpdateProductMutation,
  useAdminChangeProductStatusMutation,
  useAdminBulkChangeProductStatusMutation,
  useAdminSetProductCategoriesMutation,
  // Variants
  useAdminAddVariantMutation,
  useAdminUpdateVariantMutation,
  useAdminDeactivateVariantMutation,
  // Images
  useAdminGetProductImagesQuery,
  useAdminUploadImageMutation,
  useAdminReorderImagesMutation,
  useAdminDeleteImageMutation,
} = catalogApi;
