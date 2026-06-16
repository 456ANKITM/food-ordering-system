// src/redux/middleware/authPersist.js
export const authPersistMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Save user state to localStorage after every action
  if (action.type.includes("user/setUser") || action.type.includes("user/logoutUser")) {
    const { user } = store.getState().user;
    if (user) {
      localStorage.setItem("persisted_user", JSON.stringify(user));
      localStorage.setItem("persisted_auth", "true");
    } else {
      localStorage.removeItem("persisted_user");
      localStorage.removeItem("persisted_auth");
    }
  }
  
  return result;
};