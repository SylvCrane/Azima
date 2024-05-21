import React from 'react';
import "../../css/style.css"; 
import "../../css/password.css"; 
//import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export const ForgotPassword = () => {
    const [resetEmail, setResetEmail] = useState("");
    const [sentMessage, setSentMessage] = useState("");
    const [alertMessage, setAlertMessage] = useState(""); // Variable that stores message at the bottom of page depending on whether user input.
    
    // Variable for email pattern regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    
    //const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        console.log(resetEmail);

        // First check is email address entered is a valid email address
        if(!emailRegex.test(resetEmail)) {
            setAlertMessage("Invalid email address.");
            setSentMessage("");
            return;
        }

        // Fetch api once validation of user input is successful 
        fetch("https://azimatours.onrender.com/api/forgot-password", {
            method: "POST",
            crossDomain: true, 
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                email: resetEmail
            }),
        })
            
        .then((res) => res.json())
        .then((data) => {
            console.log(data, "resetEmail");
            if (data.status === "ok") {
                setSentMessage(`Email sent to ${resetEmail}!\n\n\nPlease check your inbox to reset your password.`);
                // Clear email input once the link to the email has been sent as well as the alert message
                setResetEmail("");
                setAlertMessage(""); 
                console.log("Email sent!");
            }
            else if (data.error === "user_registered") {
                setAlertMessage(`${resetEmail} is not registered with Azima. Please create an account instead.`);
                // Clear email input once the link to the email has been sent as well as the sent message
                setResetEmail("");
                setSentMessage("");
            }
            else {
                setAlertMessage("Could not send email. Please check your email or try again later.");
                setSentMessage("");
            }
        });
    }
   
    return (
        
        <div className="container">
            <div className="forgot-password-container">
                <form className="forgot-password-form" onSubmit={handleSubmit}>
                    <br></br><br></br>
                    <h1>Forgot password?</h1><br></br>
                    <p>Enter your email address</p>
                    <br></br>
                    <input value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} id="resetEmail" placeholder="email@gmail.com" required/>
                    <br></br><br></br>
                    <button type="submit">submit</button>
                    <br></br><br></br><br></br>
                    <Link className="link-btn" to = "/account/signup">Email does not exist? Register here.</Link><br/><br/>
                    <br></br>
                    {sentMessage && 
                        <div className="success">{sentMessage}</div>
                    }
                    {alertMessage && 
                        <div className="alert">{alertMessage}</div>
                    } 
              
                </form>
            </div>
        </div>
    );
}