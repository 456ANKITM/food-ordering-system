import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api`,
    credentials: "include", 
  }),

  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    signupUser: builder.mutation({
      query: (data) => ({
        url: "/auth/registerUser",
        method: "POST",
        body: data,
      }),
    }),

    getUser: builder.query({
      query: () => "/auth/me",
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {useLoginUserMutation, useSignupUserMutation, useGetUserQuery, useLogoutMutation} = authApi