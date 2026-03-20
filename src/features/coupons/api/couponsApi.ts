import { baseApi } from "@shared/api";
import type { ApiResponse, PaginatedResult } from "@shared/types";
import type {
  CouponListItemDto,
  CouponDetailDto,
  CouponUsageItemDto,
  CreateCouponRequest,
  UpdateCouponRequest,
  GetCouponsParams,
} from "@features/coupons/types";

export const couponsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Queries ───────────────────────────────────────────────────────────────

    adminGetCoupons: builder.query<
      PaginatedResult<CouponListItemDto>,
      GetCouponsParams
    >({
      query: ({
        page = 1,
        pageSize = 20,
        search,
        isActive,
        sortBy = "newest",
      }) => {
        const params = new URLSearchParams({
          page: String(page),
          pageSize: String(pageSize),
          sortBy,
        });
        if (search) params.set("search", search);
        if (isActive !== undefined) params.set("isActive", String(isActive));
        return `/v1/coupons?${params.toString()}`;
      },
      transformResponse: (
        response: ApiResponse<PaginatedResult<CouponListItemDto>>,
      ) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: "Coupons" as const,
                id,
              })),
              { type: "Coupons" as const, id: "LIST" },
            ]
          : [{ type: "Coupons" as const, id: "LIST" }],
    }),

    adminGetCouponById: builder.query<CouponDetailDto, number>({
      query: (id) => `/v1/coupons/${id}`,
      transformResponse: (response: ApiResponse<CouponDetailDto>) =>
        response.data,
      providesTags: (_r, _e, id) => [{ type: "Coupons" as const, id }],
    }),

    adminGetCouponUsages: builder.query<
      PaginatedResult<CouponUsageItemDto>,
      { id: number; page?: number; pageSize?: number }
    >({
      query: ({ id, page = 1, pageSize = 20 }) =>
        `/v1/coupons/${id}/usages?page=${page}&pageSize=${pageSize}`,
      transformResponse: (
        response: ApiResponse<PaginatedResult<CouponUsageItemDto>>,
      ) => response.data,
    }),

    // ── Mutations ─────────────────────────────────────────────────────────────

    adminCreateCoupon: builder.mutation<
      ApiResponse<CouponDetailDto>,
      CreateCouponRequest
    >({
      query: (body) => ({
        url: "/v1/coupons",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Coupons" as const, id: "LIST" }],
    }),

    adminUpdateCoupon: builder.mutation<
      ApiResponse<CouponDetailDto>,
      { id: number } & UpdateCouponRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/v1/coupons/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Coupons" as const, id },
        { type: "Coupons" as const, id: "LIST" },
      ],
    }),

    adminDeactivateCoupon: builder.mutation<void, number>({
      query: (id) => ({
        url: `/v1/coupons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Coupons" as const, id },
        { type: "Coupons" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useAdminGetCouponsQuery,
  useAdminGetCouponByIdQuery,
  useAdminGetCouponUsagesQuery,
  useAdminCreateCouponMutation,
  useAdminUpdateCouponMutation,
  useAdminDeactivateCouponMutation,
} = couponsApi;
