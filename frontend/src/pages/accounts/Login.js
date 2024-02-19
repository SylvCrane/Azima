import React, { useState } from "react";
import "../../css/style.css";
import * as Components from './Components';

export const Login = () => {

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
        <Components.Container>
            <Components.Form onSubmit={handleSubmit}>
            <Components.Title>Sign In</Components.Title>
            <Components.Input value={email} onChange={(e) => setEmail(e.target.value)} id="loginEmail" placeholder="email@gmail.com" required/>
            <Components.Input value={password} onChange={(e) => setPass(e.target.value)} type="password" id="loginPassword" placeholder="********" required/>
            <Components.Button type="submit">Sign In</Components.Button>
            <br/>
            <br/>{alertMessage && <div className="alert">{alertMessage}</div>}<br/>
        
        </Components.Form>
        </Components.Container>
    )
}