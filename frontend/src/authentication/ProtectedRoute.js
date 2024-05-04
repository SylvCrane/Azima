import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "./UserState";

export const ProtectedRoute = ({ children }) => {
    const [user] = useUser();
    const location = useLocation();

    if (!user.isAuthenticated) {
        return <Navigate to="/account/login" />;
    }

    // If user is authenticated and trying to access the editor, redirect them
    // However, allow access to other authenticated routes like /account/user
    if (user.isAuthenticated && location.pathname === "/acccount/user") {
        return <Navigate to="/account" />;
    }

    return children;
};