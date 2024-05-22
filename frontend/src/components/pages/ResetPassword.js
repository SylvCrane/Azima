import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import "../../css/style.css"; 
import "../../css/password.css"; 

export const ResetPassword = () => {
    const [resetPassword, setResetPassword] = useState("");
    const { id, token } = useParams();
    const [successMessage, setSuccessMessage] = useState("");
    const [alertMessage, setAlertMessage] = useState(""); // Variable that stores message at the bottom of page depending on whether user input.

    // Pattern regex to ensure user password matches the password criteria.
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()\-_=+{};:,<.>`~]{8,}$/

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!passwordRegex.test(resetPassword)){
            setAlertMessage("Password must contain a minimum of eight characters, at least one uppercase letter and one number.");
            setSuccessMessage("");
            return;
            
        }

        fetch(`https://azimatours.onrender.com/api/account/reset-password/${id}/${token}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                password: resetPassword,
            }),
        })
       
        .then((res) => res.json())
        .then((data) => {

            if (data.status === "ok") {
                setSuccessMessage("Password updated successfully! Login with your new password.");
                setAlertMessage("");
            } 
            else if (data.status === "no_update") {
                setAlertMessage("Failed to update password. Try again.");
                setSuccessMessage("");
            }
            else {
                setAlertMessage("Error occurred. Try again later or contact the Azima team.");
            }
        });
    }

    return (
        <div className="container">
            <div className="forgot-password-container">
                <form className="forgot-password-form" onSubmit={handleSubmit}>
                <br></br><br></br><br></br>
                    <h1>Reset Password</h1><br></br>
                    <p>Enter your new password</p><br></br>
                    <input type="password" value={resetPassword} onChange={(e) => setResetPassword(e.target.value)} id="resetPassword" placeholder="********" required />
                    <br></br><br></br>
                    
                    <button type="submit">Update Password</button>

                    <br></br><br></br>
                    <Link className="link-btn" to = "/account/login">Login to your account.</Link><br/><br/>
                    <br></br>
                    {successMessage && 
                        <div className="success">{successMessage}</div>
                    }
                    {alertMessage && 
                        <div className="alert">{alertMessage}</div>
                    } 

                </form>
            </div>
        </div>
    );
}