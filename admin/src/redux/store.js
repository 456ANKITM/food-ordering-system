import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import { notificationApi } from "./api/notificationApi";
import { orderApi } from "./api/orderApi";
import { foodApi } from "./api/foodApi";
import { adminApi } from "./api/adminApi";
import { userApi } from "./api/userApi";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    [authApi.reducerPath]: authApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [foodApi.reducerPath]: foodApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(notificationApi.middleware)
      .concat(orderApi.middleware)
      .concat(foodApi.middleware)
      .concat(adminApi.middleware)
      .concat(userApi.middleware),
});
