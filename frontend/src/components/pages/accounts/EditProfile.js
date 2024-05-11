import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/style.css";
import "../../../css/editprofile.css";
import axios from "axios";
import { useUser } from "../../../authentication/UserState";
import AccountLogo from '../../../assets/AzimaAccountLogo.svg';

export const EditProfile = () => {
    const [user, setUser] = useUser();
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [email] = useState(user.email);
    const [bio, setBio] = useState(user.bio);
    const [company, setCompany] = useState(user.company);
    const [location, setLocation] = useState(user.location);
    const [newProfileImage, setNewProfileImage] = useState(user.profileImage || AccountLogo);
    const [newProfileFile, setNewProfileFile] = useState(null);
    const [alertMessage, setAlertMessage] = useState("");
    const navigate = useNavigate();

    const handleProfileImageChange = (event) => {
        const file = event.target.files[0];
        setNewProfileFile(file);
        setNewProfileImage(URL.createObjectURL(file));
    };

    // const handleRemoveProfileImage = () => {
    //     setNewProfileImage(AccountLogo);
    //     setNewProfileFile(null);
    //     // Optionally update the backend here if necessary
    //     setUser({
    //         ...user,
    //         profileImage: AccountLogo // Use AccountLogo if profileImage is not returned
    //     });
    // };

    const handleSave = async () => {
        try {

            if (!firstName.trim() || !lastName.trim() ) {
                setAlertMessage("First and last name cannot be empty");
                return; // Don't proceed with saving if required fields are empty
            }

            const formData = new FormData();
            formData.append("firstName", firstName);
            formData.append("lastName", lastName);
            formData.append("email", email);
            formData.append("bio", bio);
            formData.append("company", company);
            formData.append("location", location);
            
            if (newProfileFile) {
                formData.append("profileImage", newProfileFile);
            } 
            else if (newProfileImage === "") {
                formData.append("profileImage", ""); // Sending empty string to indicate removal
            }
            
    
            axios.put("http://localhost:8082/api/userprofile", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            .then(res => {
                const data = res.data;
                console.log(data);
                if (data.status === "ok") {
                    // Assuming 'ok' means profile was updated successfully
                    
                    setAlertMessage("Profile updated successfully!");
                    console.log("Profile update successful!");
                    setUser({
                        ...user,
                        email: data.user.email,
                        firstName: data.user.firstName,
                        lastName: data.user.lastName,
                        bio: data.user.bio,
                        company: data.user.company,
                        location: data.user.location,
                        profileImage: data.user.profileImage || AccountLogo
                    });
                    navigate("/account");
                } 
                else if (data.error === "existing_email") {
                    console.log("email in use");
                    setAlertMessage("Email is already in use.");
                }

            })

            
        } 
        catch (error) {
            console.error("Error updating profile:", error);
            setAlertMessage("Failed to update profile. Please check your internet connection or contact support.");
        }
    };

    return (
        <div className="edit-profile-page">
            <br/>
            <h1>Edit Profile</h1>
            <div className="profile-image-section">
                <div className="profile-image-container">
                    {/* Set profile image to Account Logo if user doesnt add new profile image*/}
                    <img className="profile-image" src={newProfileImage} alt="Profile" />
                </div>
                <div className="profile-image-change">
                <label htmlFor="profileImageInput" className="profile-image-button">Change photo</label>
                <input 
                    type="file"
                    id="profileImageInput"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleProfileImageChange} // Only handles adding new photos
                />
                {/* <button className="remove-photo-button" onClick={handleRemoveProfileImage}>
                    Remove photo
                </button> */}
                </div>
            </div>
            
            <div className="form-section">
                <div className="form-group">
                    <label htmlFor="firstName">First Name:</label>
                    <textarea value={firstName} onChange={(e) => setFirstName(e.target.value)}
                        id="firstName"
                        className="edit-textarea"
                        placeholder="Enter your first name"
                    />
                    <br></br>
                    <label htmlFor="lastName">Last Name:</label>
                    <textarea value={lastName} onChange={(e) => setLastName(e.target.value)}
                        id="LastName"
                        className="edit-textarea"
                        placeholder="Enter your last name"
                    />
                    <br></br>
                    <label htmlFor="bio">Bio:</label>
                    <textarea value={bio} onChange={(e) => setBio(e.target.value)}
                        id="bio"
                        className="edit-textarea"
                        placeholder="Enter your bio"
                    />
                    <br></br>
                    <label htmlFor="company">Company:</label>
                    <textarea value={company} onChange={(e) => setCompany(e.target.value)}
                        id="company"
                        className="edit-textarea"
                        placeholder="Enter your company"
                    />
                    <br></br>
                    <label htmlFor="location">Location:</label>
                    <textarea value={location} onChange={(e) => setLocation(e.target.value)}
                        id="location"
                        className="edit-textarea"
                        placeholder="Enter your location"
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