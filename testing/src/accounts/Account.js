// page that allows user to either signup or sign in.

import React from "react";
import "../styles.css";
import { Login } from "./Login";
import { SignUp } from "./Signup";
import {useState } from "react";

function Account() {

  // Line allows us to get the state 
  const [currentForm, setCurrentForm] = useState('');

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }

  return (
    <div className="App">
      {
        currentForm === "login" ? <Login onFormSwitch={toggleForm} /> : <SignUp onFormSwitch={toggleForm} />
      }
    </div>
  );
}

export default Account;