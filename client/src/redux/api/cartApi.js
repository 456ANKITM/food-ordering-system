import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
    credentials: "include",
  }),
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => ({
        url: "/",
      }),
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation({
      query: (data) => ({
        url: "/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),
    updateQuantity: builder.mutation({
      query: ({ foodId, quantity }) => ({
        url: `/updateCartItemQuantity/${foodId}`,
        method: "PATCH",
        body: { quantity },
      }),
      invalidatesTags: ["Cart"],
    }),
    removeItem: builder.mutation({
      query: (foodId) => ({
        url: `/item/${foodId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    clearCart: builder.mutation({
      query: () => ({
        url: "/",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateQuantityMutation,
  useRemoveItemMutation,
  useClearCartMutation,
} = cartApi;
