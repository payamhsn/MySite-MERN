import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./screens/HomePage";
import AboutPage from "./screens/AboutPage";
import LoginPage from "./screens/LoginPage";
import RegisterPage from "./screens/RegisterPage";
import DashboardPage from "./screens/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Toast from "./components/Toast";
import axios from "axios";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    setIsLoggedIn(!!userInfo);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/users/logout");
      localStorage.removeItem("userInfo");
      setIsLoggedIn(false);
      setToast({
        show: true,
        message: "Successfully logged out!",
        type: "success",
      });
      navigate("/");
    } catch (error) {
      console.error(error);
      setToast({
        show: true,
        message: "Error logging out. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/login"
            element={
              <LoginPage
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
              />
            }
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
}
