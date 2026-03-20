import { baseApi } from "@shared/api";
import type { ApiResponse, PaginatedResult } from "@shared/types";
import type {
  CategoryTreeDto,
  CategoryDetailDto,
  ProductListItemDto,
  ProductDetailDto,
  SearchSuggestionDto,
  ProductFilters,
  ReviewListDto,
} from "../types";

export const storeCatalogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Categories ──────────────────────────────────────────────────────────

    getStorefrontCategories: builder.query<CategoryTreeDto[], void>({
      query: () => "/v1/catalog/categories",
      transformResponse: (r: ApiResponse<CategoryTreeDto[]>) => r.data,
      providesTags: ["StoreCategories"],
    }),

    getStorefrontCategoryBySlug: builder.query<CategoryDetailDto, string>({
      query: (slug) => `/v1/catalog/categories/${slug}`,
      transformResponse: (r: ApiResponse<CategoryDetailDto>) => r.data,
    }),

    // ── Products ────────────────────────────────────────────────────────────

    getStorefrontProducts: builder.query<
      PaginatedResult<ProductListItemDto>,
      ProductFilters
    >({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters.page) params.set("page", String(filters.page));
        if (filters.pageSize) params.set("pageSize", String(filters.pageSize));
        if (filters.categorySlug)
          params.set("categorySlug", filters.categorySlug);
        if (filters.search) params.set("search", filters.search);
        if (filters.brand) params.set("brand", filters.brand);
        if (filters.minPrice != null)
          params.set("minPrice", String(filters.minPrice));
        if (filters.maxPrice != null)
          params.set("maxPrice", String(filters.maxPrice));
        if (filters.sortBy) params.set("sortBy", filters.sortBy);
        if (filters.inStock != null)
          params.set("inStock", String(filters.inStock));
        return `/v1/catalog/products?${params.toString()}`;
      },
      transformResponse: (
        r: ApiResponse<PaginatedResult<ProductListItemDto>>,
      ) => r.data,
      providesTags: ["StoreProducts"],
    }),

    getStorefrontProductBySlug: builder.query<ProductDetailDto, string>({
      query: (slug) => `/v1/catalog/products/${slug}`,
      transformResponse: (r: ApiResponse<ProductDetailDto>) => r.data,
    }),

    // ── Search ──────────────────────────────────────────────────────────────

    getSearchSuggestions: builder.query<
      SearchSuggestionDto[],
      { q: string; limit?: number }
    >({
      query: ({ q, limit = 8 }) =>
        `/v1/catalog/search/suggestions?q=${encodeURIComponent(q)}&limit=${limit}`,
      transformResponse: (r: ApiResponse<SearchSuggestionDto[]>) => r.data,
    }),

    // ── Reviews ─────────────────────────────────────────────────────────────────

    getProductReviews: builder.query<
      ReviewListDto,
      { slug: string; page: number; pageSize: number }
    >({
      query: ({ slug, page, pageSize }) =>
        `/v1/catalog/products/${encodeURIComponent(slug)}/reviews?page=${page}&pageSize=${pageSize}`,
      transformResponse: (r: ApiResponse<ReviewListDto>) => r.data,
    }),
  }),
});

export const {
  useGetStorefrontCategoriesQuery,
  useGetStorefrontCategoryBySlugQuery,
  useGetStorefrontProductsQuery,
  useGetStorefrontProductBySlugQuery,
  useGetSearchSuggestionsQuery,
  useGetProductReviewsQuery,
} = storeCatalogApi;
