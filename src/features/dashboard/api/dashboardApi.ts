import { baseApi } from "@shared/api";
import type { ApiResponse } from "@shared/types";
import type { DashboardSummaryDto } from "../types";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDashboardSummary: build.query<DashboardSummaryDto, { days?: number }>({
      query: ({ days = 30 } = {}) => `/v1/admin/dashboard/summary?days=${days}`,
      transformResponse: (res: ApiResponse<DashboardSummaryDto>) => res.data,
    }),
  }),
});

export const { useGetDashboardSummaryQuery } = dashboardApi;
