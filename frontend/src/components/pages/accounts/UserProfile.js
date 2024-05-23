import React from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/style.css";
import "../../../css/userprofile.css";
import { useUser } from "../../../authentication/UserState";
import { UserTours } from "./UserTours";
import AccountLogo from '../../../assets/AzimaAccountLogo.svg';

export const UserProfile = () => {
    const [user] = useUser();
    const navigate = useNavigate();

    const handleProfileEdit = () => {
        navigate("/account/edit-profile");
    };

    return (
        <div className="user">
            <div className="user-page">
                {user.isAuthenticated && (
                    <>
                        <div className="profile-section">
                            <div className="profile-image-container" style={{justifyContent: 'center'}}>
            
                                <img className="profile-image" src={user.profileImage || AccountLogo} alt="Profile" />
                            </div>
                            <br></br>
                            <h1 className="greeting">
                                Hello {user.firstName} {user.lastName}!
                            </h1>
                            <div className="user-details">
                                {user.email && <p><strong>Email:</strong> {user.email}</p>}
                                {user.bio && <p><strong>Bio:</strong> {user.bio}</p>}
                                {user.company && <p><strong>Company:</strong> {user.company}</p>}
                                {user.location && <p><strong>Location:</strong> {user.location}</p>}
                            </div>
                            <br></br>
                                <button className="edit-btn" onClick={handleProfileEdit}>Edit Profile</button>
                            <br></br>
                        </div>
                        <div className="tours-section">
                            <UserTours/>
                        </div>
                    </>
                )}
            </div>
        </div>  
    );
};

