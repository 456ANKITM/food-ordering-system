import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import FoodDetails from "./pages/FoodDetails";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserQuery } from "./redux/api/authApi";
import { useEffect, useState } from "react";
import { logoutUser, setUser } from "./redux/slices/userSlice";
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
  const { data, isSuccess, isError, isLoading:isAuthLoading } = useGetUserQuery();


  const [authReady, setAuthReady] = useState(!isAuthenticated);

 useEffect(() => {
    if (isSuccess && data?.success) {
      const user = data.user;

      // Check role
      if (user?.role !== "customer") {
        dispatch(logoutUser());
        setAuthReady(true);
        return;
      }

      dispatch(setUser(user));
      setAuthReady(true);
    }

    if (isError) {
      dispatch(logoutUser());
      setAuthReady(true);
    }
  }, [data, isSuccess, isError, dispatch]);

   if (!authReady) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
    </div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
       <Route path="*" element={<Navigate to="/" />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
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
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
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

      <Route path="/payment-result" element={
        <ProtectedRoute> 
             <PaymentResult />
        </ProtectedRoute>
       } />

      <Route path="/search/:query" element={<SearchList />} />
      <Route path="/food/:id" element={<FoodDetails />} />
      
     
      <Route
        path="/order/:orderId"
        element={
          <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
export default App;
