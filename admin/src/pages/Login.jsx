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

    try {
      const res = await loginUser({ email, password }).unwrap();

      if (res.success) {
        const user = res.user;

        // 🚨 ROLE CHECK
        if (user?.role !== "admin") {
          setErrorMsg("Access denied. Admins only.");
          return;
        }

        await dispatch(setUser(user));

        setSuccessMsg("Login Successful");

        setTimeout(() => {
          navigate("/dashboard");
        }, 1200);
      } else {
        setErrorMsg(res.message || "Login failed");
      }
    } catch (error) {
      setErrorMsg(error?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-orange-100 relative flex items-center justify-center">
      {/* Top Left Logo */}
      <div className="absolute top-6 left-6 flex items-center space-x-3">
        <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
        <span className="text-xl font-bold text-gray-800">Admin Panel</span>
      </div>

      {/* Login Card */}
      <div className="bg-white w-95 rounded-2xl shadow-2xl p-8 border border-orange-100">
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
            <label className="text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            {isLoading ? "Logging in.." : "Log in"}
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
