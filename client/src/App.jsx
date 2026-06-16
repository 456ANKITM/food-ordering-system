import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import FoodDetails from "./pages/FoodDetails";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserQuery } from "./redux/api/authApi";
import { useEffect, useState } from "react";
import { verifyAuth, logoutUser } from "./redux/slices/userSlice";
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

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);
  const [authReady, setAuthReady] = useState(false);

  // ✅ Skip the query if not authenticated (no need to verify if not logged in)
  const { data, isSuccess, isError, isLoading: isAuthLoading } =
    useGetUserQuery(undefined, {
      skip: !isAuthenticated,
    });

  // ✅ Effect: Verify auth when user claims to be authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      // Not logged in, ready immediately
      setAuthReady(true);
      return;
    }

    // User claims to be authenticated, verify with backend
    if (isSuccess && data?.success) {
      const user = data.user;

      // ✅ Verify role is customer
      if (user?.role !== "customer") {
        dispatch(logoutUser());
        setAuthReady(true);
        return;
      }

      // Auth valid, update Redux
      dispatch(verifyAuth({ success: true, user }));
      setAuthReady(true);
    } else if (isError) {
      // Token invalid or expired, logout
      dispatch(logoutUser());
      setAuthReady(true);
    }
  }, [data, isSuccess, isError, isAuthenticated, dispatch]);

  // ✅ Show loading spinner while verifying auth
  if (isAuthenticated && !authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full"></div>
          <p className="text-gray-600 text-sm font-medium">Verifying session...</p>
        </div>
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

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;