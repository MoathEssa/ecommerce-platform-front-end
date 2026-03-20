import { baseApi } from "@shared/api";
import type { ApiResponse } from "@shared/types";
import type {
  GetChargesParams,
  StripeChargeDto,
  StripeChargeListDto,
} from "../types";

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    adminGetCharges: build.query<StripeChargeListDto, GetChargesParams>({
      query: ({ limit = 20, startingAfter } = {}) => {
        const params = new URLSearchParams();
        params.set("limit", String(limit));
        if (startingAfter) params.set("startingAfter", startingAfter);
        return `/v1/admin/payments/charges?${params}`;
      },
      transformResponse: (res: ApiResponse<StripeChargeListDto>) => res.data,
      providesTags: ["Charges"],
    }),

    adminGetChargeById: build.query<StripeChargeDto, string>({
      query: (chargeId) => `/v1/admin/payments/charges/${chargeId}`,
      transformResponse: (res: ApiResponse<StripeChargeDto>) => res.data,
      providesTags: (_result, _error, chargeId) => [
        { type: "Charges", id: chargeId },
      ],
    }),
  }),
});

export const { useAdminGetChargesQuery, useAdminGetChargeByIdQuery } =
  paymentsApi;
