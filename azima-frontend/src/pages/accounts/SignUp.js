import React, { useState } from "react";
import "../../css/style.css";
import "../../css/accounts.css";
import { useNavigate } from 'react-router-dom';

export const SignUp = (props) => {
    
    /* State variables for the input types - useState hook will first get the user input then set that input into the second variable */
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [company, setCompany] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [alertMessage, setAlertMessage] = useState(""); // Variable that stores message at the bottom of page depending on whether user input.

    // Variables to store pattern regex for password and email (dont add semicolon)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()\-_=+{};:,<.>`~]{8,}$/
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ 

    // Vairiable to user import useNavigate 
    const navigate = useNavigate();

    // Function that handles what happens signup button is clicked.
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents page from reloading on empty 
        console.log(firstName, lastName, company, email, password);

        let incorrectMessage = "";

        // First check the pattern for password and email is correct before making API call 
        if (!emailRegex.test(email)) {
            incorrectMessage += "Invalid email address. \n" ;
        }

        if (!passwordRegex.test(password)) {
            incorrectMessage += "Password must contain a minimum of eight characters, at least one uppercase letter and one number.";
        } 

        if (incorrectMessage) {
            setAlertMessage(incorrectMessage);
            return;
        }

        // Fetch api once validation of user input is successful 
        fetch("http://localhost:5000/signup", {
            method: "POST",
            crossDomain: true, 
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                firstName,
                lastName,
                company,
                email,
                password,
            }),
        })
            
        .then((res) => res.json())
        .then((data) => {
        console.log(data, "userSignup");
        
        if (data.status === "ok") {
            setAlertMessage("You are now registered with Azima!");
            navigate('/editor'); // Will redirect user to the editor page to start creating their tours. 

        } else {
            setAlertMessage("Email is already in use. Please login instead.");
        }

        });  
    }

    return (

        <div className="signup-container">
            <br/>
            <form className="signup-form" onSubmit={handleSubmit}>
                <br/><h1>SIGN UP</h1><br/>
                <input value={firstName} name="firstName" onChange={(e) => setFirstName(e.target.value)} id="firstName" placeholder="First Name *" required /><br/>
                <input value={lastName} name="lastName" onChange={(e) => setLastName(e.target.value)} id="lastName" placeholder="Last Name *" required/><br/>
                <input value={company} name="company" onChange={(e) => setCompany(e.target.value)} id="company" placeholder="Company" autoComplete="off"/><br/>
                <input value={email} onChange={(e) => setEmail(e.target.value)} id="loginEmail" placeholder="email@gmail.com *" required/><br/>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" id="loginPassword" placeholder="******** *" required/><br/>
                <br/>
                <button type="submit">Sign up</button>
                <div className= "required-text"> <br/> (* Required fields must be filled in to create an account)<br/> </div>
                <br/>
                { alertMessage && (
                    <div className="alert">{ alertMessage }</div>
                )} <br/>

                <button className="link-btn" type ="button" onClick={() => props.onFormSwitch('login-form')}>Already have an account? Sign in here.</button><br/><br/>
            </form>
            <br/>
        </div>
    
    )
}