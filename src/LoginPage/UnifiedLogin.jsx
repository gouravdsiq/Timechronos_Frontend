import React, { useState, useEffect } from "react";
import axiosInstance from "../axios/config";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/authSlice";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { showToast, TOAST_TYPES } from "../ToastMessage";
import "react-toastify/dist/ReactToastify.css";

const TimeChronosLogo = () => {
  return (
    <div className="flex justify-center mb-4">
      <img
        src="/assets/Time Chronos Logo(Main).png"
        alt="TimeChronos Logo"
        className="h-20 w-auto object-contain"
      />
    </div>
  );
};

// Login Component
const UnifiedLogin = ({ onLoginSuccess }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!email || !password) {
      setError("Please fill in all required fields");
      showToast("Please fill in all required fields", TOAST_TYPES.INFO);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post("/v1/auth/login", {
        email: email,
        password,
      });

      const access_token = response.data.access_token;
      const refresh_token = response.data.refresh_token;
      const message = response.data.message;

      // Show success toast
      showToast(message || "Login successfully done", TOAST_TYPES.SUCCESS);

      // Decode the JWT token to get user info
      const decoded = jwtDecode(access_token);

      dispatch(
        setCredentials({
          access_token,
          refresh_token,
          first_name: decoded.first_name,
          last_name: decoded.last_name,
          company_id: decoded.company_id,
          role: decoded.role,
          email: decoded.email,
          id: decoded.id,
          country_id:decoded.country_id,
        })
      );
console.log(access_token);

      // console.log(decoded.company_id);
      if (decoded.role === "admin") {
        onLoginSuccess("admin");
      } else if (decoded.role === "employee") {
        onLoginSuccess("employee");
      }
    } catch (err) {
      console.error("Login error:", err);

      let errorMessage =
        "Login failed. Please check your credentials and try again.";

      // Handle different types of errors
      if (err.response) {
        // Server responded with error status
        errorMessage =
          err.response.data?.error ||
          err.response.data?.message ||
          `Server error: ${err.response.status}`;
      } else if (err.request) {
        // Request was made but no response received
        errorMessage =
          "Network error. Please check your connection and try again.";
      } else {
        // Something else happened
        errorMessage = err.message || "An unexpected error occurred.";
      }

      setError(errorMessage);
      showToast(errorMessage, TOAST_TYPES.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#f2effd] px-4"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <TimeChronosLogo />

        <div className="text-center mb-6 mt-0">
          <h2 className="text-3xl font-bold text-[#5A367D] mt-0">Welcome</h2>
          <p className="text-[#9a8edf] mt-2">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="your@email.com"
              className="w-full px-3 py-2 border border-[#5A367D] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5A367D]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"} // This line toggles the input type
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5A367D]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="show-password"
                type="checkbox"
                className="h-4 w-4 text-[#5A367D] focus:ring-[#5A367D] border-gray-300 rounded"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)} // This line updates the state
              />
              <label
                htmlFor="show-password"
                className="ml-2 block text-sm text-gray-700"
              >
                Show Password
              </label>
            </div>
            <div className="text-sm">
              <button
                type="button"
                onClick={() => onLoginSuccess("forgotPassword")}
                className="text-[#5A367D] hover:underline"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-[#5A367D] text-white font-medium rounded-md hover:bg-[#4a2e69] transition disabled:opacity-75"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need an account?{" "}
            <button
              type="button"
              onClick={() => onLoginSuccess("adminSignup")}
              className="text-[#5A367D] hover:underline"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnifiedLogin;
