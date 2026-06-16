import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const foodApi = createApi({
  reducerPath: "foodApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/food`,
    credentials: "include",
  }),
  tagTypes: ["Food"],
  endpoints: (builder) => ({
    getAllFoods: builder.query({
      query: () => ({
        url: "/allFoods/admin",
      }),
      providesTags: ["Food"],
    }),
    addFood: builder.mutation({
      query: (formData) => ({
        url: "/addFood",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Food"],
    }),
    updateFood: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Food"],
    }),
    deleteFood: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Food"],
    }),
    updateFoodImage: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/updateFoodImage/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Food"],
    }),
  }),
});

export const {
  useGetAllFoodsQuery,
  useUpdateFoodImageMutation,
  useDeleteFoodMutation,
  useUpdateFoodMutation,
  useAddFoodMutation,
} = foodApi;
