import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/user`,
    credentials: "include",
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => ({
        url: "/getAll",
      }),
      providesTags: ["User"],
    }),
    getUserById: builder.query({
      query: (id) => ({
        url: `/${id}`,
      }),
      providesTags: ["User"],
    }),
  }),
});

export const { useGetAllUsersQuery, useGetUserByIdQuery } = userApi;
