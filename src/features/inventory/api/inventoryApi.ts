import { baseApi } from "@shared/api";
import type { ApiResponse, PaginatedResult } from "@shared/types";
import type {
  InventoryListItemDto,
  InventoryDetailDto,
  AdjustmentDto,
  InventoryAdjustmentResultDto,
  CreateAdjustmentRequest,
} from "../types";

export const inventoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInventoryList: builder.query<
      PaginatedResult<InventoryListItemDto>,
      {
        page?: number;
        pageSize?: number;
        search?: string;
        stockStatus?: string;
        sortBy?: string;
      }
    >({
      query: ({
        page = 1,
        pageSize = 20,
        search,
        stockStatus,
        sortBy = "sku",
      }) => {
        const params = new URLSearchParams({
          page: String(page),
          pageSize: String(pageSize),
          sortBy,
        });
        if (search) params.set("search", search);
        if (stockStatus) params.set("stockStatus", stockStatus);
        return `/v1/inventory?${params.toString()}`;
      },
      transformResponse: (
        response: ApiResponse<PaginatedResult<InventoryListItemDto>>,
      ) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ variantId }) => ({
                type: "Inventory" as const,
                id: variantId,
              })),
              { type: "Inventory", id: "LIST" },
            ]
          : [{ type: "Inventory", id: "LIST" }],
    }),

    getInventoryDetail: builder.query<InventoryDetailDto, number>({
      query: (variantId) => `/v1/inventory/${variantId}`,
      transformResponse: (response: ApiResponse<InventoryDetailDto>) =>
        response.data,
      providesTags: (_result, _err, id) => [{ type: "Inventory", id }],
    }),

    getAdjustmentHistory: builder.query<
      PaginatedResult<AdjustmentDto>,
      { variantId: number; page?: number; pageSize?: number }
    >({
      query: ({ variantId, page = 1, pageSize = 20 }) =>
        `/v1/inventory/${variantId}/adjustments?page=${page}&pageSize=${pageSize}`,
      transformResponse: (
        response: ApiResponse<PaginatedResult<AdjustmentDto>>,
      ) => response.data,
      providesTags: (_result, _err, { variantId }) => [
        { type: "Inventory", id: `adj-${variantId}` },
      ],
    }),

    createAdjustment: builder.mutation<
      InventoryAdjustmentResultDto,
      { variantId: number } & CreateAdjustmentRequest
    >({
      query: ({ variantId, ...body }) => ({
        url: `/v1/inventory/${variantId}/adjustments`,
        method: "POST",
        body,
      }),
      transformResponse: (
        response: ApiResponse<InventoryAdjustmentResultDto>,
      ) => response.data,
      invalidatesTags: (_result, _err, { variantId }) => [
        { type: "Inventory", id: variantId },
        { type: "Inventory", id: "LIST" },
        { type: "Inventory", id: `adj-${variantId}` },
      ],
    }),
  }),
});

export const {
  useGetInventoryListQuery,
  useGetInventoryDetailQuery,
  useGetAdjustmentHistoryQuery,
  useCreateAdjustmentMutation,
} = inventoryApi;
