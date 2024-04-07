import { useEffect, useState } from "react";
import "../../../css/style.css";
import "../../../css/accounts.css";
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../UserState";

export const Login = (props) => {

    // Use state variables
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [alertMessage, setAlertMessage] = useState(""); // Variable that stores message at the bottom of page depending on whether user input.
    const [user, setUser] = useUser();

    // Variable for email pattern regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    // Vairiable to user import useNavigate 
    const navigate = useNavigate();

    // Function that handles what happens signup button is clicked.
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        console.log(loginEmail, loginPassword);

        // First check is email address entered is a valid email address
        if(!emailRegex.test(loginEmail)) {
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
                email: loginEmail,
                password: loginPassword,
            }),
        })
            
        .then((res) => res.json())
        .then((data) => {
            console.log(data, "userLogin");

            if (data.status === "ok") {
                setAlertMessage("Logged in successfully!");
                setUser ({
                    isAuthenticated: true,
                    email: data.user.email,
                });
                console.log("user login authenticated");
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
    }

    useEffect (() => {
        if (user.isAuthenticated) {
            navigate("/editor");
        }
    });

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h1>SIGN IN</h1><br/>
                <input value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} id="loginEmail" placeholder="email@gmail.com" required/><br/>
                <input value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} type="password" id="loginPassword" placeholder="********" required/>
                <br/>
                <br/><button type="submit">Sign In</button><br/>
                <br/><button className="link-btn">Forgot password?</button><br/>
                <br/>
                { alertMessage && (
                    <div className="alert">{ alertMessage }</div>
                )} <br/>

            <button className="link-btn" type ="button" onClick={() => navigate('/account/signup')}>Don't have an account? Register here.</button><br/>
            </form>
        </div>  
    )
}