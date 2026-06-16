import { createSlice } from "@reduxjs/toolkit";

// ✅ Hydrate from localStorage on app load
const getInitialState = () => {
  const persisted = localStorage.getItem("persisted_user");
  const isAuth = localStorage.getItem("persisted_auth");
  
  if (persisted && isAuth) {
    return {
      user: JSON.parse(persisted),
      isAuthenticated: true,
    };
  }
  
  return {
    user: null,
    isAuthenticated: false,
  };
};

const initialState = getInitialState();

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    updateUser: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
  },
});

export const { setUser, logoutUser, updateUser } = userSlice.actions;
export default userSlice.reducer;