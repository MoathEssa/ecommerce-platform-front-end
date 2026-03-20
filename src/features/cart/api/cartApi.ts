import { baseApi } from "@shared/api";
import type { ApiResponse, PaginatedResult } from "@shared/types";
import type { AdminCartListItemDto, CartDto } from "../types";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminGetCarts: builder.query<
      PaginatedResult<AdminCartListItemDto>,
      { page?: number; pageSize?: number; search?: string; status?: string }
    >({
      query: ({ page = 1, pageSize = 20, search, status }) => {
        const params = new URLSearchParams({
          page: String(page),
          pageSize: String(pageSize),
        });
        if (search) params.set("search", search);
        if (status) params.set("status", status);
        return `/v1/cart/admin/carts?${params.toString()}`;
      },
      transformResponse: (
        response: ApiResponse<PaginatedResult<AdminCartListItemDto>>,
      ) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ cartId }) => ({
                type: "AdminCarts" as const,
                id: cartId,
              })),
              { type: "AdminCarts", id: "LIST" },
            ]
          : [{ type: "AdminCarts", id: "LIST" }],
    }),

    adminGetCartByUserId: builder.query<CartDto, string>({
      query: (userId) => `/v1/cart?userId=${encodeURIComponent(userId)}`,
      transformResponse: (response: ApiResponse<CartDto>) => response.data,
      providesTags: (_result, _err, userId) => [
        { type: "AdminCarts", id: userId },
      ],
    }),

    sendCartReminderEmail: builder.mutation<
      void,
      { toEmail: string; subject: string; body: string }
    >({
      query: (body) => ({
        url: "/v1/cart/admin/send-reminder",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useAdminGetCartsQuery,
  useAdminGetCartByUserIdQuery,
  useSendCartReminderEmailMutation,
} = cartApi;
