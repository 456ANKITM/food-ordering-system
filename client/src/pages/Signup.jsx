import { useState } from "react";
import Footer from "../components/Footer";
import PublicNavbar from "../components/PublicNavbar";
import { useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../redux/api/authApi";

import SuccessToast from "../components/SuccessToast";
import ErrorToast from "../components/ErrorToast";

const Signup = () => {
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

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

    if (form.password !== form.confirmPassword) {
      setErrorMsg("Passwords do not match!");
      setShowError(true);
      return;
    }

    try {
      const res = await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
      }).unwrap();

      if (res.success) {
        setSuccessMsg(res?.message || "Account created successfully!");
        setShowSuccess(true);

        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } else {
        setErrorMsg(res.message);
        setShowError(true);
      }
    } catch (error) {
      setErrorMsg(error?.data?.message || "Sign up failed");
      setShowError(true);
    }
  };

  return (
    <>
      <PublicNavbar />

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
            Create Your <span className="text-orange-500">Account</span>
          </h2>

          <p className="text-gray-500 text-sm text-center mt-2">
            Join us and enjoy delicious food delivery 🚀
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full mt-1 px-4 py-3 border rounded-xl"
            />

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full mt-1 px-4 py-3 border rounded-xl"
            />

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full mt-1 px-4 py-3 border rounded-xl"
            />

            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="w-full mt-1 px-4 py-3 border rounded-xl"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl"
            >
              {isLoading ? "Creating..." : "Sign Up"}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-orange-500 cursor-pointer font-medium"
            >
              Login
            </span>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Signup;
