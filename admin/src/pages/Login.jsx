import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useLoginUserMutation } from "../redux/api/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/userSlice";
import ErrorToast from "../components/ErrorToast";
import SuccessToast from "../components/SuccessToast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await loginUser({ email, password }).unwrap();

      if (res.success) {
        const user = res.user;

        // Double-check role on the frontend as well (backend already enforces this)
        if (user?.role !== "admin") {
          setErrorMsg("Access denied. Admins only.");
          return;
        }

        // ✅ Dispatch user to Redux so state is immediately populated
        dispatch(setUser(user));

        setSuccessMsg("Login successful. Redirecting...");
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 1000);
      } else {
        setErrorMsg(res.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setErrorMsg(error?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 relative flex items-center justify-center">
      {/* Top Left Logo */}
      <div className="absolute top-6 left-6 flex items-center space-x-3">
        <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
        <span className="text-xl font-bold text-gray-800">Admin Panel</span>
      </div>

      {/* Login Card */}
      <div className="bg-white w-96 rounded-2xl shadow-2xl p-8 border border-orange-100">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to manage your restaurant system
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-600" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              autoComplete="email"
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-600" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-xs text-center text-gray-400 mt-6">
          © {new Date().getFullYear()} Restaurant Admin System
        </p>
      </div>

      {/* Toasts */}
      {successMsg && (
        <SuccessToast message={successMsg} onClose={() => setSuccessMsg("")} />
      )}
      {errorMsg && (
        <ErrorToast message={errorMsg} onClose={() => setErrorMsg("")} />
      )}
    </div>
  );
};

export default Login;