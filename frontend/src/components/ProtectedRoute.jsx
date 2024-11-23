import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ isLoggedIn, children }) => {
  const location = useLocation();

  return isLoggedIn ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
