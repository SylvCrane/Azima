import React, { useState } from "react";
import "../../css/style.css";

export const Login = (props) => {

    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email);
    }

    return (
        <div className="account-container">
            <br/><h1>Login</h1><br/>
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="email">Email </label>
                <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="email@gmail.com" id="email" name="email" />
                <label htmlFor="password"><br/>Password</label>
                <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
                <br/>    
                <button type="submit">Log In</button>
            </form>
            <button className="link-btn" onClick={() => props.onFormSwitch('signup-form')}>Don't have an account? Sign Up here.</button>
        </div>
    )
}