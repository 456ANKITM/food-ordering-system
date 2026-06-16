import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import FoodDetails from "./pages/FoodDetails";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserQuery } from "./redux/api/authApi";
import { useEffect, useState } from "react";
import {  logoutUser, setUser, setAuthChecked } from "./redux/slices/userSlice";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import AllOrders from "./pages/AllOrders";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SearchList from "./pages/SearchList";
import OrderDetails from "./pages/OrderDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import PaymentResult from "./pages/PaymentResult";
import { Loader } from "./components/Loader";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const App = () => {
  const dispatch = useDispatch();
  const { data, isLoading, isError, isSuccess } = useGetUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

const {authChecked} = useSelector(state => state.user.authChecked);

useEffect(() => {
  if (isSuccess && data?.success) {
    dispatch(setUser(data.user));
  } else if (isError) {
    dispatch(logoutUser());
  }
}, [isSuccess, isError, data, dispatch]);

useEffect(() => {
  // ONLY mark checked when request is finished
  if (!isLoading) {
    dispatch(setAuthChecked());
  }
}, [isLoading, dispatch]);

  // if (!authChecked) return <Loader />;


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

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;