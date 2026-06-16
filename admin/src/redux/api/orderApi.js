import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/order`,
    credentials: "include",
  }),
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    getTodayOrders: builder.query({
      query: () => ({
        url: "/getTodayOrders",
      }),
      providesTags: ["Order"],
    }),
    getAdminOrderById: builder.query({
      query: (orderId) => ({
        url: `/admin/${orderId}`,
      }),
      providesTags: ["Order"],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ orderId, orderStatus }) => ({
        url: `/${orderId}/status`,
        method: "PATCH",
        body: { orderStatus },
      }),
      invalidatesTags: ["Order"],
    }),
    getOrderStatusCount: builder.query({
      query: () => ({
        url: "/orderStatusCount",
      }),
      providesTags: ["Order"],
    }),
    getAllOrders: builder.query({
      query: () => ({
        url: "/all",
      }),
      providesTags: ["Order"],
    }),
  }),
});

export const {
  useGetTodayOrdersQuery,
  useGetAdminOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useGetOrderStatusCountQuery,
  useGetAllOrdersQuery,
} = orderApi;
