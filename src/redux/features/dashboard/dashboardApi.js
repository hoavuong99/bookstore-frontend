import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "/api/v1",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", "Bearer " + token);
      return headers;
    },
  }),
  tagTypes: ["Dashboard"],
  endpoints: (builder) => ({
    getDashboardSummary: builder.query({
      query: () => "/dashboard/summary",
      transformResponse: (response) => response?.data || response,
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardSummaryQuery } = dashboardApi;
export default dashboardApi;
