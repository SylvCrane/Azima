import { useEffect, useState } from "react";
import "../../../css/style.css";
import "../../../css/accounts.css";
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../../authentication/UserState";

export const Login = () => {

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
        fetch("http://localhost:8082/api/login", {
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
            // when the user is logged in creates a variable called isLoggedIn and sets the value to true
            

            if (data.status === "ok") {
                setAlertMessage("Logged in successfully!");
                setUser ({
                    isAuthenticated: true,
                    email: data.user.email,
                    firstName: data.user.firstName,
                    lastName: data.user.lastName,
                    bio: data.user.bio,
                    company: data.user.company,
                    location: data.user.location,
                    profileImage: data.user.profileImage
                });
                console.log("user login authenticated");
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
        if (user?.isAuthenticated) {
            navigate("/account");
        }
    }, [navigate, user]);


    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h1>Welcome back</h1>
                <p>Please enter your details to sign in</p><br/>
                <input value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} id="loginEmail" placeholder="email@gmail.com" required/><br/>
                <input value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} type="password" id="loginPassword" placeholder="********" required/>
                <br/>
                <br/><button type="submit">Sign In</button><br/>
                <br/><button className="link-btn" type ="button" onClick={() => navigate('/account/forgot-password')}>Forgot password?</button><br/>
                <br/>
                { alertMessage && (
                    <div className="alert">{ alertMessage }</div>
                )} <br/>

            <button className="link-btn" type ="button" onClick={() => navigate('/account/signup')}>Don't have an account? Register here.</button><br/>
            </form>
        </div>  
    )
}