import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
