import React, { useState } from "react";
import "../../css/style.css";

export const SignUp = (props) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [company, setCompany] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email);
    }

    return (
        <div className="account-container">
            <br/><h1>Sign Up</h1><br/><br/>
            <form className="signup-form" onSubmit={handleSubmit}>
                <label htmlFor="firstName">First Name *</label>
                <input value={firstName} name="firstName" onChange={(e) => setFirstName(e.target.value)} id="firstName" placeholder="First Name" required title="First name cannot be blank."/>
                <label htmlFor="lastName">Last Name *</label>
                <input value={lastName} name="lastName" onChange={(e) => setLastName(e.target.value)} id="lastName" placeholder="Last Name" required title="Last name cannot be blank."/>
                <label htmlFor="company">Company </label>
                <input value={company} name="company" onChange={(e) => setCompany(e.target.value)} id="" placeholder="First Name" required/>
                <label htmlFor="email">Email *</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="email@gmail.com" id="email" name="email" required title="Email cannot be blank."/>
                <label htmlFor="password">Password *</label>
                <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" required title="Password cannot be blank."/>
                <br/><button type="submit">Sign Up</button><br/>
            </form>
            <br/><p>(* Required fields must be filled in to create an account)</p> <br/>
            <button className="link-btn" onClick={() => props.onFormSwitch('login')}>Already have an account with Azima? Login here.</button>
        </div>
    )
}