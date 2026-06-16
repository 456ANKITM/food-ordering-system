import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEYS = {
  USER: "app_user",
  AUTH: "app_authenticated",
  TOKEN: "app_token",
};

// ✅ Hydrate from localStorage on app load
const getInitialState = () => {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    const isAuth = localStorage.getItem(STORAGE_KEYS.AUTH);
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

    if (user && isAuth === "true" && token) {
      return {
        user: JSON.parse(user),
        isAuthenticated: true,
        token: token,
      };
    }
  } catch (error) {
    console.error("Failed to hydrate user from localStorage:", error);
  }

  return {
    user: null,
    isAuthenticated: false,
    token: null,
  };
};

const initialState = getInitialState();

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // ✅ Set user and persist to localStorage
    setUser: (state, action) => {
      const user = action.payload.user;
      const token = action.payload.token;

      state.user = user;
      state.isAuthenticated = true;
      state.token = token;

      // Persist to localStorage
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.AUTH, "true");
      if (token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      }
    },

    // ✅ Logout and clear everything
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;

      // Clear localStorage completely
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.AUTH);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem("user"); // Old key compatibility

      // Clear cookies
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    },

    // ✅ Update user profile
    updateUser: (state, action) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
        // Re-persist updated user
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(state.user));
      }
    },

    // ✅ Set token (for cases where token updates without full user update)
    setToken: (state, action) => {
      state.token = action.payload;
      if (action.payload) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, action.payload);
      }
    },

    // ✅ Verify auth (called after useGetUserQuery)
    verifyAuth: (state, action) => {
      const { success, user } = action.payload;
      if (success && user) {
        state.user = user;
        state.isAuthenticated = true;
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        localStorage.setItem(STORAGE_KEYS.AUTH, "true");
      } else {
        // Token invalid, clear everything
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.AUTH);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
      }
    },
  },
});

export const { setUser, logoutUser, updateUser, setToken, verifyAuth } =
  userSlice.actions;
export default userSlice.reducer;