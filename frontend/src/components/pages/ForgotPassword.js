// Inside the ForgotPassword.js file
import React from 'react';
import "../../css/style.css"; 
import "../../css/forgotpassword.css"; 
import { useNavigate } from 'react-router-dom';

export const ForgotPassword = () => {

    const navigate = useNavigate();
   
    return (
        
        <div className="container">
            <div className="forgot-password-container">
                <form className="forgot-password-form">
                    <br></br><br></br><br></br>
                    <h1>Forgot password?</h1>
                    <p>Enter your email address</p>
                    <br></br>
                    <input id="forgot-password-email" placeholder="email@gmail.com" required/><br/>
                    <br></br>
                    <button type="submit">submit</button>
                    <br></br><br></br>
                    <button className="link-btn" type ="button" onClick={() => navigate('/account/signup')}>Email does not exist? Register here.</button><br/><br/>
                </form>
            </div>
        </div>
        
    );
}