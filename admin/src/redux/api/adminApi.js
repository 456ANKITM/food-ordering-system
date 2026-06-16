import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/admin`,
    credentials: "include",
  }),
  tagTypes: ["Admin"],
  endpoints: (builder) => ({
    getTodayStats: builder.query({
      query: () => ({
        url: "/getTodayStats",
      }),
      providesTags: ["Admin"],
    }),
    getWeekStats: builder.query({
      query: () => ({
        url: "/getWeekStats",
      }),
      providesTags: ["Admin"],
    }),
    getMonthStats: builder.query({
      query: () => ({
        url: "/getMonthStats",
      }),
      providesTags: ["Admin"],
    }),
    getYearStats: builder.query({
      query: () => ({
        url: "/getYearStats",
      }),
      providesTags: ["Admin"],
    }),
    getPaidOrders: builder.query({
      query: () => ({
        url: "/payments",
      }),
    }),
  }),
});

export const {
  useGetTodayStatsQuery,
  useGetWeekStatsQuery,
  useGetMonthStatsQuery,
  useGetYearStatsQuery,
  useGetPaidOrdersQuery,
} = adminApi;
