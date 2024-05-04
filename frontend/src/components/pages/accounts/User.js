import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/style.css";
import { useUser } from "../../../authentication/UserState";

export const User = () => {
    const [user] = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user.isAuthenticated) {
            navigate("/account/login");
        }
    }, [user, navigate]);

    return (
        <div className="user-page">
            <h1>User Details</h1>
            {user.isAuthenticated && (
                <>
                    <p>Hello, {user.email}!</p>
                </>
            )}
        </div>
    );
}