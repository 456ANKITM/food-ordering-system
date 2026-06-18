import { useState } from "react";
import Footer from "../components/Footer";
import PublicNavbar from "../components/PublicNavbar";
import { useNavigate } from "react-router-dom";
import { useSignupUserMutation } from "../redux/api/authApi";

import SuccessToast from "../components/SuccessToast";
import ErrorToast from "../components/ErrorToast";

import { CheckCircle, Utensils, Clock, TrendingUp, Mail, Lock, User, ArrowRight } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [signupUser, { isLoading }] = useSignupUserMutation();

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setErrorMsg("Please fill in all fields");
      setShowError(true);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErrorMsg("Passwords do not match!");
      setShowError(true);
      return;
    }

    if (form.password.length < 6) {
      setErrorMsg("Password must be at least 6 characters");
      setShowError(true);
      return;
    }

    try {
      const res = await signupUser({
        name: form.name,
        email: form.email,
        password: form.password,
      }).unwrap();

      if (res.success) {
        setSuccessMsg(res?.message || "Account created successfully! Redirecting to login...");
        setShowSuccess(true);

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setErrorMsg(res.message);
        setShowError(true);
      }
    } catch (error) {
      setErrorMsg(error?.data?.message || "Sign up failed. Please try again.");
      setShowError(true);
    }
  };

  return (
    <>
      <PublicNavbar />

      {showSuccess && (
        <SuccessToast message={successMsg} onClose={() => setShowSuccess(false)} />
      )}

      {showError && (
        <ErrorToast message={errorMsg} onClose={() => setShowError(false)} />
      )}

      <div className="min-h-screen bg-linear-to-b from-white via-orange-50 to-white flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl">
          
          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 items-center">

            {/* LEFT SECTION - PREMIUM HERO */}
            <div className="hidden lg:flex flex-col justify-center px-12 py-16 relative">
              {/* Decorative accent */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-orange-200 rounded-full blur-3xl opacity-40 -z-10"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-red-200 rounded-full blur-3xl opacity-40 -z-10"></div>

              {/* Main heading */}
              <div className="mb-4">
                <span className="inline-block text-orange-600 font-semibold text-sm tracking-wider uppercase mb-4">
                  Welcome to FoodHub
                </span>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                  Hungry? We've got you covered 🍕
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed mb-2">
                  Order from Nepal's finest restaurants and get hot meals delivered in minutes, not hours.
                </p>
              </div>

              {/* Feature cards with icons */}
              <div className="mt-12 space-y-5">
                
                <div className="flex gap-4 group">
                  <div className="shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-linear-to-br from-orange-500 to-red-500 text-white">
                      <Utensils className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">500+ Restaurants</h3>
                    <p className="text-sm text-gray-600 mt-1">Choose from thousands of dishes across all cuisines</p>
                  </div>
                </div>

                <div className="flex gap-4 group">
                  <div className="shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-linear-to-br from-orange-500 to-red-500 text-white">
                      <Clock className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">20-30 Min Delivery</h3>
                    <p className="text-sm text-gray-600 mt-1">Lightning-fast delivery to your doorstep, every time</p>
                  </div>
                </div>

                <div className="flex gap-4 group">
                  <div className="shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-linear-to-br from-orange-500 to-red-500 text-white">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">Real-Time Tracking</h3>
                    <p className="text-sm text-gray-600 mt-1">Track your order live and know exactly when it arrives</p>
                  </div>
                </div>

              </div>

              {/* Trust section */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">Trusted by 50,000+ users</span>
                </div>
                <p className="text-sm text-gray-600 italic">
                  "The fastest way to get my favorite meals. Never looking back!" — Sarah, Kathmandu
                </p>
              </div>

            </div>

            {/* RIGHT SECTION - SIGNUP FORM */}
            <div className="flex items-center justify-center lg:px-12">
              <div className="w-full max-w-md">

                {/* Form Header */}
                <div className="mb-10">
                  <h2 className="text-4xl font-bold text-gray-900 mb-3">
                    Create your account
                  </h2>
                  <p className="text-gray-600">
                    Join thousands of hungry customers. Takes less than a minute.
                  </p>
                </div>

                {/* Google Sign-up Button */}
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 mb-6 border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:border-orange-500 hover:bg-orange-50 transition-all duration-300 group"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-sm text-gray-500 font-medium">Or sign up with email</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                {/* Signup Form */}
                <form onSubmit={handleSubmit} className="space-y-4">

                  {/* Name Input */}
                  <div className="relative">
                    <div className={`flex items-center gap-3 px-4 py-3 border-2 rounded-xl transition-all duration-300 ${
                      focusedField === 'name' 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}>
                      <User className="h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Full Name"
                        className="w-full bg-transparent outline-none text-gray-900 placeholder-gray-500"
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="relative">
                    <div className={`flex items-center gap-3 px-4 py-3 border-2 rounded-xl transition-all duration-300 ${
                      focusedField === 'email' 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}>
                      <Mail className="h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Email Address"
                        className="w-full bg-transparent outline-none text-gray-900 placeholder-gray-500"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="relative">
                    <div className={`flex items-center gap-3 px-4 py-3 border-2 rounded-xl transition-all duration-300 ${
                      focusedField === 'password' 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}>
                      <Lock className="h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Password (min 6 characters)"
                        className="w-full bg-transparent outline-none text-gray-900 placeholder-gray-500"
                      />
                    </div>
                  </div>

                  {/* Confirm Password Input */}
                  <div className="relative">
                    <div className={`flex items-center gap-3 px-4 py-3 border-2 rounded-xl transition-all duration-300 ${
                      focusedField === 'confirmPassword' 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}>
                      <Lock className="h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('confirmPassword')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Confirm Password"
                        className="w-full bg-transparent outline-none text-gray-900 placeholder-gray-500"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 mt-6"
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Get Started
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>

                </form>

                {/* Terms & Privacy */}
                <p className="text-xs text-gray-500 text-center mt-6">
                  By signing up, you agree to our{" "}
                  <span className="text-orange-600 font-medium cursor-pointer hover:underline">Terms of Service</span>
                  {" "}and{" "}
                  <span className="text-orange-600 font-medium cursor-pointer hover:underline">Privacy Policy</span>
                </p>

                {/* Login Link */}
                <p className="text-center text-gray-600 mt-6 text-sm">
                  Already have an account?{" "}
                  <span
                    onClick={() => navigate("/login")}
                    className="text-orange-600 font-semibold cursor-pointer hover:text-orange-700 transition-colors"
                  >
                    Sign in
                  </span>
                </p>

              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Signup;