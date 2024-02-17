import React, { useState } from "react";
import "../styles.css";

export const Login = (props) => {

    // Use state variables
    const [email, setEmail] = useState('');
    const [password, setPass] = useState('');
    const [alertMessage, setAlertMessage] = useState(''); // Variable that stores message at the bottom of page depending on whether user input.

    // Variable for email pattern regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    // Function that handles what happens signup button is clicked.
    const handleSubmit = (e) => {
        e.preventDefault(); 
        console.log(email, password);

        // First check is email address entered is a valid email address
        if(!emailRegex.test(email)) {
            setAlertMessage("Invalid email address");
            return;
        }

        // Fetch api once validation of user input is successful 
        fetch("http://localhost:5000/Login", {
            method: "POST",
            crossDomain: true, 
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        })
            
        .then((res) => res.json())
        .then((data) => {
        console.log(data, "userLogin");

        if (data.status === "ok") {
            setAlertMessage("Logged in successfully!");
        } 
        else if (data.error === "email_not_found") {
            setAlertMessage("Email not found. Please check email address again.");
        } 
        else if (data.error === "incorrect_password") {
            setAlertMessage("Incorrect password. Please check password again.");
        } 
        else {
            setAlertMessage("Cannot login. Please check details again.");
        }

        });
    }

    return (
        <div className="account-container">
            <br/><br/><h1>Login</h1><br/><br/>
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="email">Email </label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@gmail.com" id="email" name="email" required/>
                <label htmlFor="password"><br/>Password</label>
                <input value={password} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" required/>
                <br/>    
                <button className="login-button" type="submit">Log In</button>
            </form>
            <br/>
            <button className="link-btn" onClick={() => props.onFormSwitch('signup-form')}>Don't have an account with Azima? Sign Up here.</button><br/><br/>
            <br/>{alertMessage && <div className="alert">{alertMessage}</div>}<br/>
        </div>
    )
}