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
  },
});

export const { setUser, logoutUser, setAuthChecked } = userSlice.actions;
export default userSlice.reducer;