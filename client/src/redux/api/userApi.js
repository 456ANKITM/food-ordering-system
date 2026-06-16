import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/user`,
    credentials: "include",
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({
        url: "/profile",
      }),
      providesTags: ["User"],
    }),
  }),
});

export const { useGetProfileQuery } = userApi;
