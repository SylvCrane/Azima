import React from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/style.css";
import "../../../css/userprofile.css";
import { useUser } from "../../../authentication/UserState";

export const UserProfile = () => {
    const [user] = useUser();
    const navigate = useNavigate();

    const handleProfileEdit = () => {
        navigate("/account/edit-profile");
    };

    const handleViewTours = () => {
        navigate("/account/my-tours");
    };

    return (
        <div className="user-page">
            {user.isAuthenticated && (
                <>
                    <div className="profile-section">
                        <div className="profile-image-container">
                            {user.profileImage && (
                                <img className="profile-image" src={user.profileImage} alt="Profile" />
                            )}
                        </div>
                        <h1 className="greeting">
                            Hello {user.firstName} {user.lastName}!
                        </h1>
                        <div className="user-details">
                            {user.email && <p><strong>Email:</strong> {user.email}</p>}
                            {user.bio && <p><strong>Bio:</strong> {user.bio}</p>}
                            {user.company && <p><strong>Company:</strong> {user.company}</p>}
                            {user.location && <p><strong>Location:</strong> {user.location}</p>}
                        </div>
                    </div>
                    <div className="profile-buttons">
                        <button onClick={handleProfileEdit}>Edit Profile</button>
                        <button onClick={handleViewTours}>View Your Tours</button>
                    </div>
                </>
            )}
        </div>
    );
};