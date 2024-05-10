import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/style.css";
import "../../../css/editprofile.css";
import axios from "axios";
import { useUser } from "../../../authentication/UserState";
import AccountLogo from '../../../assets/AzimaAccountLogo.svg';

export const EditProfile = () => {
    const [user, setUser] = useUser();
    const [email, setEmail] = useState(user.email);
    const [bio, setBio] = useState(user.bio);
    const [company, setCompany] = useState(user.company);
    const [location, setLocation] = useState(user.location);
    const [newProfileImage, setNewProfileImage] = useState(user.profileImage || AccountLogo);
    const [newProfileFile, setNewProfileFile] = useState(null);
    const [alertMessage, setAlertMessage] = useState("");
    const navigate = useNavigate();

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleBioChange = (event) => {
        setBio(event.target.value);
    };
    
    const handleCompanyChange = (event) => {
        setCompany(event.target.value);
    };

    const handleLocationChange = (event) => {
        setLocation(event.target.value);
    };

    const handleProfileImageChange = (event) => {
        const file = event.target.files[0];
        setNewProfileFile(file);
        setNewProfileImage(URL.createObjectURL(file));
    };

    // const handleRemoveProfileImage = () => {
    //     setNewProfileImage("");
    //     setNewProfileFile(null);
    //     // Optionally update the backend here if necessary
    //     setUser({
    //         ...user,
    //         profileImage: "" // Use AccountLogo if profileImage is not returned
    //     });
    // };

    const handleSave = async () => {
        try {
            const formData = new FormData();
            formData.append("email", email);
            formData.append("bio", bio);
            formData.append("company", company);
            formData.append("location", location);
            
            if (newProfileFile) {
                formData.append("profileImage", newProfileFile);
            } else if (newProfileImage === "") {
                formData.append("profileImage", ""); // Sending empty string to indicate removal
            }
    
            const response = await axios.put("http://localhost:8082/api/userprofile", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
    
            // Update user state
            const updatedUser = response.data.user;
            setAlertMessage("Profile updated successfully!");
            console.log("Profile update successful!");
            setUser({
                ...user,
                bio: updatedUser.bio,
                company: updatedUser.company,
                location: updatedUser.location,
                profileImage: updatedUser.profileImage || "" 
            });
            navigate("/account");
    
        } catch (error) {
            console.error("Error updating profile:", error);
            setAlertMessage("Failed to update profile.");
        }
    };

    return (
        <div className="edit-profile-page">
            <br/>
            <h1>Edit Profile</h1><br/>
            <div className="profile-image-section">
                <div className="profile-image-container">
                    {/* Set profile image to Account Logo if user doesnt add new profile image*/}
                    <img className="profile-image" src={newProfileImage || AccountLogo} alt="Profile" />
                </div>
                <div className="profile-image-change">
                    <label htmlFor="profileImageInput" className="profile-image-button">Change photo</label>
                    <input
                        type="file"
                        id="profileImageInput"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleProfileImageChange}
                    />
                    {/* {newProfileImage && (
                        <button className="remove-photo-button" onClick={handleRemoveProfileImage}>Remove photo</button>
                    )} */}
                </div>
            </div>
            <br></br>
            <div className="form-section">
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <textarea
                        id="email"
                        className="email-textarea"
                        placeholder="Enter your email"
                        value={email}
                        onChange={handleEmailChange}
                    />
                    <br></br>
                    <label htmlFor="bio">Bio:</label>
                    <textarea
                        id="bio"
                        className="bio-textarea"
                        placeholder="Enter your bio"
                        value={bio}
                        onChange={handleBioChange}
                    />
                    <br></br>
                    <label htmlFor="company">Company:</label>
                    <textarea
                        id="company"
                        className="company-textarea"
                        placeholder="Enter your company"
                        value={company}
                        onChange={handleCompanyChange}
                    />
                    <br></br>
                    <label htmlFor="location">Location:</label>
                    <textarea
                        id="location"
                        className="location-textarea"
                        placeholder="Enter your location"
                        value={location}
                        onChange={handleLocationChange}
                    />
                    <br></br>
                    {alertMessage && (
                        <div className="alert">{ alertMessage }</div>
                    )} <br/>
                </div>
                <center><button className="save-button" onClick={handleSave}>Save Changes</button></center><br></br>
            </div>
        </div>
    );
};