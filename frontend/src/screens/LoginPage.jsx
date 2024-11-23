import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Toast from "../components/Toast";

const LoginPage = ({ isLoggedIn, setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state, default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate(from, { replace: true });
    }
  }, [isLoggedIn, navigate, from]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/api/users/auth", { email, password });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setIsLoggedIn(true);

      setToast({
        show: true,
        message: `Successfully logged in! Redirecting...`,
        type: "success",
      });

      // Short delay before redirect to show the success message
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1500);
    } catch (error) {
      console.error(error);
      setToast({
        show: true,
        message:
          error.response?.data?.message ||
          "Login failed. Please check your credentials.",
        type: "error",
      });
    }
  };

  const redirectMessage =
    from !== "/dashboard" ? "Please log in to access this page." : "";

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md m-4">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {redirectMessage && (
          <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md">
            {redirectMessage}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 w-full transition-colors duration-200"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            Register
          </Link>
        </div>
      </div>
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
};

export default LoginPage;
