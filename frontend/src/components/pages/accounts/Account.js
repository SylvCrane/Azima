// page that allows user to either signup or sign in.

import React, { useState } from "react";
import "../../../css/style.css";
import "../../../css/accounts.css"
import { Login } from "./Login";
import { SignUp } from "./SignUp";

export const Account = () =>  {
  // Line allows us to get the state 
  const [currentForm, setCurrentForm] = useState('login-form');

  // Function to toggle between login and signup forms
  const toggleForm = () => {
    setCurrentForm(currentForm === 'login-form' ? 'signup-form' : 'login-form');
  }

  return (
    <div className="account-container">
      {
        currentForm === "login-form" ? 
          <Login onFormSwitch={toggleForm} /> : 
          <SignUp onFormSwitch={toggleForm} />
      }
    </div>
  );
}