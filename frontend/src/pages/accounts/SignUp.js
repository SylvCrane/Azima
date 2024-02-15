import React, { useState } from "react";
import "../../css/style.css";

export const SignUp = (props) => {
    
    /* State variables for the input types - useState hook will first get the user input then set that input into the second variable */
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [company, setCompany] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alertMessage, setAlertMessage] = useState(''); // Variable that stores message at the bottom of page depending on whether user input.

    // Variables to store pattern regex for password and email (dont add semicolon)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    // Function that handles what happens signup button is clicked.
    const handleSubmit = (e) => {
        e.preventDefault(); 
        console.log(firstName, lastName, company, email, password);

        let incorrectMessage = "";

        // First check the pattern for password and email is correct before making API call 
        if (!emailRegex.test(email)) {
            /* setAlertMessage("Invalid email address.");
            return; */
            incorrectMessage += "Invalid email address. \n" ;
        }

        if (!passwordRegex.test(password)) {
            /* setAlertMessage("Password must contain a minimum of eight characters, at least one uppercase letter, one lowercase letter and one number.");
            return; */
            incorrectMessage += "Password must contain a minimum of eight characters, at least one uppercase letter, one lowercase letter and one number.";
        } 

        if (incorrectMessage) {
            setAlertMessage(incorrectMessage);
            return;
        }

        // Fetch api once validation of user input is successful 
        fetch("http://localhost:5000/Signup", {
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
        } else {
            setAlertMessage("Email is already in use. Please login instead.");
        }

        });  
    }

    return (
        <div className="account-container">
            <br/><br/><h1>Sign Up</h1><br/><br/>
            <form className="signup-form" onSubmit={handleSubmit}>
                <label htmlFor="firstName">First Name *</label>
                <input value={firstName} name="firstName" onChange={(e) => setFirstName(e.target.value)} id="firstName" placeholder="First Name" required/>
                <label htmlFor="lastName">Last Name *</label>
                <input value={lastName} name="lastName" onChange={(e) => setLastName(e.target.value)} id="lastName" placeholder="Last Name" required/>
                <label htmlFor="company">Company </label>
                <input value={company} name="company" onChange={(e) => setCompany(e.target.value)} id="" placeholder="Company"/>
                <label htmlFor="email">Email *</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} id="email" placeholder="email@gmail.com" required/>
                <label htmlFor="password">Password *</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="********" id="password" minLength="8" required/>
                <br/><button className="signup-button" type="submit">Sign Up</button><br/>
            </form>
            <br/><p>(* Required fields must be filled in to create an account)</p> <br/>
            <button className="link-btn" onClick={() => props.onFormSwitch('login')}>Already have an account with Azima? Login here.</button><br/><br/>
            <br/>{alertMessage && <div className="alert">{alertMessage}</div>}<br/>
        </div>
    )
}