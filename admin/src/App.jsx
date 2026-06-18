import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import { useGetUserQuery } from "./redux/api/authApi";
import { setUser, logoutUser, setAuthChecked } from "./redux/slices/userSlice";
import { Loader } from "./components/Loader";
import OrderDetails from "./pages/OrderDetails";
import AddFood from "./pages/AddFood";
import AllOrders from "./pages/AllOrders";
import AllUsers from "./pages/AllUsers";
import AllPayments from "./pages/AllPayments";
import UserDetails from "./pages/UserDetails";
import Menu from "./pages/Menu";

const App = () => {
  const dispatch = useDispatch();
  const { data, isLoading, isError, isSuccess } =
    useGetUserQuery(undefined, {
      refetchOnFocus: false,
      refetchOnReconnect: false,
    });

  const { authChecked } = useSelector((state) => state.user);


  useEffect(() => {
    if (isSuccess) {
      if (data?.success && data.user?.role === "admin") {
        dispatch(setUser(data.user));
      } else {
        dispatch(logoutUser());
      }
      dispatch(setAuthChecked(true));
    }

    if (isError) {
      dispatch(logoutUser());
      dispatch(setAuthChecked(true));
    }
  }, [isSuccess, isError, data, dispatch]);


  const showLoader =
    !authChecked && (isLoading || (!isSuccess && !isError));

  if (showLoader) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <Loader />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public */}
      <Route
        path="/"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />

      {/* Protected */}
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
