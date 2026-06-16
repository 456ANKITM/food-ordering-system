import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/notification`,
    credentials: "include",
  }),
  tagTypes: ["Notification"],
  endpoints: (builder) => ({
    getMyNotifications: builder.query({
      query: () => "/getMyNotifications",
      providesTags: ["Notification"],
    }),

    getUnreadNotificationCount: builder.query({
      query: () => "/getUnreadCount",
      providesTags: ["Notification"],
    }),

    markAllAsRead: builder.mutation({
      query: () => ({
        url: "/markAllNotificationAsRead",
        method: "PUT",
      }),
      invalidatesTags: ["Notification"],
    }),

    deleteAllNotifications: builder.mutation({
      query: () => ({
        url: "/deleteAllNotifications",
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetMyNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkAllAsReadMutation,
  useDeleteAllNotificationsMutation,
} = notificationApi;
