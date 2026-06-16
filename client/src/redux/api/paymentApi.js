import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/payment`,
    credentials: "include",
  }),
  tagTypes: ["Payment"],
  endpoints: (builder) => ({
    createStripeIntent: builder.mutation({
      query: (orderId) => ({
        url: "/create-intent",
        method: "POST",
        body: { orderId },
      }),
    }),
    retryStripeIntent: builder.mutation({
      query: (orderId) => ({
        url: "/retry-intent",
        method: "POST",
        body: { orderId },
      }),
    }),
  }),
});

export const { useCreateStripeIntentMutation, useRetryStripeIntentMutation } =
  paymentApi;
