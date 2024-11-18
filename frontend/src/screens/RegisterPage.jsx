import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Toast from "../components/Toast";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Basic password validation
    if (password.length < 6) {
      setToast({
        show: true,
        message: "Password must be at least 6 characters long",
        type: "error",
      });
      return;
    }

    try {
      const { data } = await axios.post("/api/users", {
        name,
        email,
        password,
      });

      setToast({
        show: true,
        message: "Registration successful! Redirecting to login...",
        type: "success",
      });

      // Clear form
      setName("");
      setEmail("");
      setPassword("");

      // Short delay before redirect to show the success message
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error(error);
      setToast({
        show: true,
        message:
          error.response?.data?.message ||
          (error.response?.status === 409
            ? "Email already exists"
            : "Registration failed. Please try again."),
        type: "error",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md m-4">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="name" className="block font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength={2}
            />
          </div>
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
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
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
              minLength={6}
            />
            <p className="text-sm text-gray-500 mt-1">
              Must be at least 6 characters long
            </p>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 w-full transition-colors duration-200"
          >
            Register
          </button>
        </form>
        <div className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            Login
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

export default RegisterPage;
