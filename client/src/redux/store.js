import { configureStore } from "@reduxjs/toolkit";
import { foodApi } from "./api/foodApi";
import { authApi } from "./api/authApi";
import { cartApi } from "./api/cartApi";
import { orderApi } from "./api/orderApi";
import { notificationApi } from "./api/notificationApi";
import { paymentApi } from "./api/paymentApi";
import { userApi } from "./api/userApi";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    [foodApi.reducerPath]: foodApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(foodApi.middleware)
      .concat(authApi.middleware)
      .concat(cartApi.middleware)
      .concat(orderApi.middleware)
      .concat(notificationApi.middleware)
      .concat(paymentApi.middleware)
      .concat(userApi.middleware),
});
