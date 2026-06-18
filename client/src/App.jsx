import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import FoodDetails from "./pages/FoodDetails";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

import { useDispatch, useSelector } from "react-redux";
import { useGetUserQuery } from "./redux/api/authApi";
import { useEffect } from "react";

import { logoutUser, setUser, setAuthChecked } from "./redux/slices/userSlice";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import PublicOnlyRoute from "./components/PublicOnlyRoute";
import ProtectedRoute from "./components/ProtectedRoute";

import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import AllOrders from "./pages/AllOrders";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SearchList from "./pages/SearchList";
import OrderDetails from "./pages/OrderDetails";
import PaymentResult from "./pages/PaymentResult";

import { Loader } from "./components/Loader";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const App = () => {
  const dispatch = useDispatch();

  const { user, authChecked } = useSelector((state) => state.user);

  const {
    data,
    isLoading,
    isSuccess,
    isError,
  } = useGetUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // =========================
  // AUTH HYDRATION HANDLER
  // =========================
  useEffect(() => {
    if (isSuccess && data?.success) {
      dispatch(setUser(data.user));
      dispatch(setAuthChecked(true));
    }

    if (isError) {
      dispatch(logoutUser());
      dispatch(setAuthChecked(true));
    }
  }, [isSuccess, isError, data, dispatch]);

  // =========================
  // SAFE LOADING STATE
  // =========================
  const authLoading =
    isLoading &&
    !isSuccess &&
    !isError &&
    !authChecked;

  if (authLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <Loader />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/search/:query" element={<SearchList />} />
      <Route path="/food/:id" element={<FoodDetails />} />

      {/* Auth Routes */}
      <Route
        path="/signup"
        element={
          <PublicOnlyRoute>
            <Signup />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />

      {/* Protected Routes */}
      <Route path="/cart" element={<Cart />} />

      <Route
        path="/order"
        element={
          <ProtectedRoute>
            <Elements stripe={stripePromise}>
              <Orders />
            </Elements>
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
        path="/order/:orderId"
        element={
          <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payment-result"
        element={
          <ProtectedRoute>
            <PaymentResult />
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;