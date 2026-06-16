import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const foodApi = createApi({
  reducerPath: "foodApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/food`,
    credentials: "include",
  }),
  tagTypes: ["Food"],
  endpoints: (builder) => ({
    getFeaturedFoods: builder.query({
      query: () => ({
        url: "/featuredFoods",
      }),
      providesTags: ["Food"],
    }),
    getBesellers: builder.query({
      query: () => ({
        url: "/bestSellers",
      }),
      providesTags: ["Food"],
    }),
    getAllFoods: builder.query({
      query: () => ({
        url: "/allFoods",
      }),
      providesTags: ["Food"],
    }),
    getFoodById: builder.query({
      query: (id) => ({
        url: `/${id}`,
      }),
      providesTags: ["Food"],
    }),
    searchFoods: builder.query({
      query: (query) => ({
        url: "/search",
        params: { query },
      }),
      providesTags: ["Food"],
    }),
  }),
});

export const {
  useGetFeaturedFoodsQuery,
  useGetBesellersQuery,
  useGetAllFoodsQuery,
  useGetFoodByIdQuery,
  useSearchFoodsQuery,
} = foodApi;
