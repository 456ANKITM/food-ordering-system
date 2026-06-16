import { useState } from "react";
import Footer from "../components/Footer";
import PublicNavbar from "../components/PublicNavbar";
import { useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../redux/api/authApi";

import SuccessToast from "../components/SuccessToast";
import ErrorToast from "../components/ErrorToast";

const Login = () => {
  const navigate = useNavigate();

  const [loginUser, { isLoading }] = useLoginUserMutation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setErrorMsg("Email and password are required!");
      setShowError(true);
      return;
    }

    try {
      const res = await loginUser({
        email: form.email,
        password: form.password,
      }).unwrap();

      if (res.success) {
        setSuccessMsg(res.message || "Login successful!");
        setShowSuccess(true);

        // optional: store user locally (for UI state)
        localStorage.setItem("user", JSON.stringify(res.user));

        setTimeout(() => {
          navigate("/");
        }, 1200);
      } else {
        setErrorMsg(res.message || "Login failed");
        setShowError(true);
      }
    } catch (error) {
      setErrorMsg(error?.data?.message || "Invalid credentials");
      setShowError(true);
    }
  };

  return (
    <>
      <PublicNavbar />

      {/* TOASTS */}
      {showSuccess && (
        <SuccessToast
          message={successMsg}
          onClose={() => setShowSuccess(false)}
        />
      )}

      {showError && (
        <ErrorToast message={errorMsg} onClose={() => setShowError(false)} />
      )}

      <div className="min-h-screen bg-linear-to-r from-orange-50 via-white to-orange-100 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-orange-100">
          {/* Heading */}
          <h2 className="text-3xl font-bold text-gray-900 text-center">
            Welcome <span className="text-orange-500">Back</span>
          </h2>

          <p className="text-gray-500 text-sm text-center mt-2">
            Login to continue ordering your favorite meals 🍽️
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Email */}
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full mt-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-600">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full mt-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl shadow-md transition"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Signup Link */}
          <p className="text-center text-sm text-gray-500 mt-5">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-orange-500 cursor-pointer font-medium"
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Login;
