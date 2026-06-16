import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/order`,
    credentials: "include",
  }),
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "/",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Order"],
    }),
    getMyOrders: builder.query({
      query: () => ({
        url: "/getMyOrders",
      }),
      providesTags: ["Order"],
    }),
    cancelOrder: builder.mutation({
      query: (orderId) => ({
        url: `/cancel/${orderId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Order"],
    }),
    getOrderDetails: builder.query({
      query: (orderId) => ({
        url: `/${orderId}`,
      }),
      providesTags: ["Order"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useCancelOrderMutation,
  useGetOrderDetailsQuery,
} = orderApi;
