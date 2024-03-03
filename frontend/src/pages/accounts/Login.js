"use client";

import { useState } from "react";
import "../../css/style.css";
import "../../css/accounts.css";
import { useNavigate } from 'react-router-dom';

export const Login = (props) => {

    // Use state variables
    const [email, setEmail] = useState("");
    const [password, setPass] = useState("");
    const [alertMessage, setAlertMessage] = useState(""); // Variable that stores message at the bottom of page depending on whether user input.

    // Variable for email pattern regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    // Vairiable to user import useNavigate 
    const navigate = useNavigate();

    // Function that handles what happens signup button is clicked.
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        console.log(email, password);

        // First check is email address entered is a valid email address
        if(!emailRegex.test(email)) {
            setAlertMessage("Invalid email address");
            return;
        }

        // Fetch api once validation of user input is successful 
        fetch("http://localhost:5000/login", {
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
            navigate('/editor'); // Will redirect user to the editor page to start creating their tours. 
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

        /*// Authentication 

        try {
            const response = await account("login", {
                email, 
                password, 
                redirect: false,
            });

            if (response.alertMessage) {
                setAlertMessage("Invalid Credentials");
                return;
            }
        } catch (error) {
            console.log(error);
        }*/
    }

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h1>LOGIN</h1><br/>
                <input value={email} onChange={(e) => setEmail(e.target.value)} id="loginEmail" placeholder="email@gmail.com" required/><br/>
                <input value={password} onChange={(e) => setPass(e.target.value)} type="password" id="loginPassword" placeholder="********" required/>
                <br/>
                <br/><button type="submit">Sign In</button><br/>
                <br/><button className="link-btn">Forgot password?</button><br/>
                <br/>
                { alertMessage && (
                    <div className="alert">{ alertMessage }</div>
                )} <br/>

                <button className="link-btn" onClick={() => props.onFormSwitch('signup-form')}>Don't have an account? Register here.</button><br/>
            </form>
        </div>
        
    )
}