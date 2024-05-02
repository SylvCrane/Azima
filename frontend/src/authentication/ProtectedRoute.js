import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "./UserState";

export const ProtectedRoute = ({ children }) => {
  const [user] = useUser(); // Destructuring user from useUser hook
  if (!user.isAuthenticated) {
    alert("You need to login first to access this page");
    return <Navigate to="/account/login" />; // Immediately navigates to login page
  }

  // If user is authenticated, render the children components
  return children;
};
