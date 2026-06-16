import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { logoutUser } from "./slices/userSlice";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// ✅ Create base query with token handling
export const createBaseQuery = () => {
  return fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api`,
    credentials: "include", // ✅ Send cookies automatically
    prepareHeaders: (headers, { getState }) => {
      // ✅ Add token from Redux store to headers
      const token = getState().user.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  });
};

// ✅ Wrapper to handle token expiry/auth errors
export const baseQueryWithReauth = async (args, api, extraOptions) => {
  const baseQuery = createBaseQuery();
  let result = await baseQuery(args, api, extraOptions);

  // ✅ Handle 401 (Unauthorized) - token expired or invalid
  if (result.error?.status === 401) {
    console.warn("Auth token expired or invalid, logging out");
    api.dispatch(logoutUser());
  }

  // ✅ Handle 403 (Forbidden) - user role changed
  if (result.error?.status === 403) {
    console.warn("Access forbidden, logging out");
    api.dispatch(logoutUser());
  }

  return result;
};