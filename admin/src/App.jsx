import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";

import { useGetUserQuery } from "./redux/api/authApi";
import { setUser, logoutUser } from "./redux/slices/userSlice";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import OrderDetails from "./pages/OrderDetails";
import Menu from "./pages/Menu";
import AddFood from "./pages/AddFood";
import AllOrders from "./pages/AllOrders";
import AllUsers from "./pages/AllUsers";
import UserDetails from "./pages/UserDetails";
import AllPayments from "./pages/AllPayments";

const App = () => {
  const dispatch = useDispatch();

  const { data, isSuccess, isError, isLoading } = useGetUserQuery();

  useEffect(() => {
    if (isSuccess && data?.success) {
      const user = data.user;
      if (user?.role !== "admin") {
        dispatch(logoutUser());
        return;
      }
      dispatch(setUser(user));
    }

    if (isError) {
      dispatch(logoutUser());
    }
  }, [data, isSuccess, isError, dispatch]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order/:orderId"
        element={
          <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/menu"
        element={
          <ProtectedRoute>
            <Menu />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-food"
        element={
          <ProtectedRoute>
            <AddFood />
          </ProtectedRoute>
        }
      />
      <Route
        path="/all-orders"
        element={
          <ProtectedRoute>
            <AllOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/all-users"
        element={
          <ProtectedRoute>
            <AllUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/all-payments"
        element={
          <ProtectedRoute>
            <AllPayments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/:id"
        element={
          <ProtectedRoute>
            <UserDetails />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
