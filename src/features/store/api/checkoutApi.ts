import { baseApi } from "@shared/api";
import type { ApiResponse } from "@shared/types";
import type {
  PlaceOrderRequest,
  PlaceOrderResponse,
  CalculateFreightRequest,
  FreightOptionDto,
} from "../types";

export const checkoutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    placeOrder: builder.mutation<PlaceOrderResponse, PlaceOrderRequest>({
      query: (body) => ({
        url: "/v1/checkout",
        method: "POST",
        body,
        headers: {
          "Idempotency-Key": crypto.randomUUID(),
        },
      }),
      transformResponse: (r: ApiResponse<PlaceOrderResponse>) => r.data,
      invalidatesTags: ["Cart"],
    }),

    calculateFreight: builder.mutation<
      FreightOptionDto[],
      CalculateFreightRequest
    >({
      query: (body) => ({
        url: "/v1/checkout/freight",
        method: "POST",
        body,
      }),
      transformResponse: (r: ApiResponse<FreightOptionDto[]>) => r.data ?? [],
    }),
  }),
});

export const { usePlaceOrderMutation, useCalculateFreightMutation } =
  checkoutApi;
