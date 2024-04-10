import React, { useState, useEffect } from "react";
import "../../../css/style.css";
import "../../../css/accounts.css";
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../UserState";

export const SignUp = (props) => {
    
    /* State variables for the input types - useState hook will first get the user input then set that input into the second variable */
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [company, setCompany] = useState("");
    const [signUpEmail, setSignUpEmail] = useState("");
    const [signUpPassword, setSignUpPassword] = useState("");
    const [alertMessage, setAlertMessage] = useState(""); // Variable that stores message at the bottom of page depending on whether user input.
    const [user, setUser] = useUser();

    // Variables to store pattern regex for password and email (dont add semicolon)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()\-_=+{};:,<.>`~]{8,}$/
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ 

    // Vairiable to user import useNavigate 
    const navigate = useNavigate();

    // Function that handles what happens signup button is clicked.
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents page from reloading on empty 
        console.log(firstName, lastName, company, signUpEmail, signUpPassword);

        let incorrectMessage = "";

        // First check the pattern for password and email is correct before making API call 
        if (!emailRegex.test(signUpEmail)) {
            incorrectMessage += "Invalid email address. \n" ;
        }

        if (!passwordRegex.test(signUpPassword)) {
            incorrectMessage += "Password must contain a minimum of eight characters, at least one uppercase letter and one number.";
        } 

        if (incorrectMessage) {
            setAlertMessage(incorrectMessage);
            return;
        }

        // Fetch api once validation of user input is successful 
        fetch("http://localhost:8082/api/signup", {
            method: "POST",
            crossDomain: true, 
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                company: company,
                email: signUpEmail,
                password: signUpPassword,
            }),
        })
            
        .then((res) => res.json())
        .then((data) => {
            console.log(data, "userSignup");
            
            if (data.status === "ok") {
                setAlertMessage("You are now registered with Azima!");
                setUser ({
                    isAuthenticated: true,
                    email: data.email, // Refer to email object directly (since the email is being registered it should not be in mongodb yet)
                });
                console.log("user registration authenticated");

            } else {
                setAlertMessage("Email is already in use. Please login instead.");
            }

        });  
    }

    // Navigates to editor page once sign up is authenticated
    useEffect (() => {
        if (user.isAuthenticated) {
            navigate("/editor");
        }
    });

    return (

        <div className="signup-container">
            <br/>
            <form className="signup-form" onSubmit={handleSubmit}>
                <br/><h1>Create an account</h1>
                <p>Please enter your details to register</p>
                <br/>
                <input value={firstName} name="firstName" onChange={(e) => setFirstName(e.target.value)} id="firstName" placeholder="First Name *" required /><br/>
                <input value={lastName} name="lastName" onChange={(e) => setLastName(e.target.value)} id="lastName" placeholder="Last Name *" required/><br/>
                <input value={company} name="company" onChange={(e) => setCompany(e.target.value)} id="company" placeholder="Company" autoComplete="off"/><br/>
                <input value={signUpEmail} onChange={(e) => setSignUpEmail(e.target.value)} id="loginEmail" placeholder="email@gmail.com *" required/><br/>
                <input value={signUpPassword} onChange={(e) => setSignUpPassword(e.target.value)} type="password" id="loginPassword" placeholder="******** *" required/><br/>
                <br/>
                <button type="submit">sign up</button>
                <div className= "required-text"> <br/> (* Required fields must be filled in to create an account)<br/> </div>
                <br/>
                { alertMessage && (
                    <div className="alert">{ alertMessage }</div>
                )} <br/>

                <button className="link-btn" type ="button" onClick={() => navigate('/account/login')}>Already have an account? Sign in here.</button><br/><br/>
            </form>
            <br/>
        </div>
    )
}