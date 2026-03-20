import { baseApi } from "@shared/api";
import type { ApiResponse } from "@shared/types";
import type { CartDto } from "../types";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<CartDto, void>({
      query: () => "/v1/cart",
      transformResponse: (r: ApiResponse<CartDto>) => r.data,
      providesTags: ["Cart"],
    }),

    addCartItem: builder.mutation<
      void,
      { variantId: number; quantity: number }
    >({
      query: (body) => ({ url: "/v1/cart/items", method: "POST", body }),
      invalidatesTags: ["Cart"],
    }),

    updateCartItem: builder.mutation<
      void,
      { itemId: number; quantity: number }
    >({
      query: ({ itemId, quantity }) => ({
        url: `/v1/cart/items/${itemId}`,
        method: "PUT",
        body: { quantity },
      }),
      invalidatesTags: ["Cart"],
    }),

    removeCartItem: builder.mutation<void, number>({
      query: (itemId) => ({
        url: `/v1/cart/items/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    clearCart: builder.mutation<void, void>({
      query: () => ({ url: "/v1/cart", method: "DELETE" }),
      invalidatesTags: ["Cart"],
    }),

    applyCoupon: builder.mutation<void, string>({
      query: (code) => ({
        url: "/v1/cart/coupon",
        method: "POST",
        body: { code },
      }),
      invalidatesTags: ["Cart"],
    }),

    removeCoupon: builder.mutation<void, void>({
      query: () => ({ url: "/v1/cart/coupon", method: "DELETE" }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
  useApplyCouponMutation,
  useRemoveCouponMutation,
} = cartApi;
