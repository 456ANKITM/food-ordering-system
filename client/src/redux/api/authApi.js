import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQuery";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // ✅ Login endpoint
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response) => {
        // ✅ Ensure token is in response
        return response;
      },
    }),

    // ✅ Signup endpoint
    signupUser: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),

    // ✅ Get current user (verify token is valid)
    getUser: builder.query({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      transformResponse: (response) => {
        return response;
      },
    }),

    // ✅ Logout endpoint
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      transformResponse: (response) => {
        return response;
      },
    }),
  }),
});

export const {
  useLoginUserMutation,
  useSignupUserMutation,
  useGetUserQuery,
  useLogoutMutation,
} = authApi;