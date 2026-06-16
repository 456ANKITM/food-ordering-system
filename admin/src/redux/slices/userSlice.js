import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  authChecked: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.authChecked = true;
    },

    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.authChecked = true;
    },

    setAuthChecked: (state) => {
      state.authChecked = true;
    },

    updateUser: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
  },
});

export const {
  setUser,
  logoutUser,
  setAuthChecked,
  updateUser,
} = userSlice.actions;


export default userSlice.reducer;