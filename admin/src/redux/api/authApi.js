import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/auth`,
    // ✅ Critical: sends the httpOnly cookie on every request
    credentials: "include",
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (userData) => ({
        url: "/admin-login",
        method: "POST",
        body: userData,
      }),
      // ✅ After login, invalidate "User" so getUser refetches automatically
      invalidatesTags: ["User"],
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      // ✅ After logout, invalidate "User" so getUser cache is cleared
      invalidatesTags: ["User"],
    }),

    getUser: builder.query({
      query: () => ({
        url: "/me",
      }),
      providesTags: ["User"],
    }),
  }),
});

export const { useLoginUserMutation, useLogoutMutation, useGetUserQuery } = authApi;