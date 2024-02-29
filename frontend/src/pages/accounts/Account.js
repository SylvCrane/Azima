// page that allows user to either signup or sign in.

/* import React from "react";
import "../../css/style.css";
import "../../css/accounts.css";
import * as Components from './components/AccountComponents';
import { Login } from "./Login";
import { SignUp } from "./SignUp";
import { useState } from "react";

export const Account = () => {
    // Boolean variables that set whether user is signing in or not - toggle variable will be switched based on what user does.
    const [$signingin, toggle] = useState(true);
    // $signingin - transient prop
    return(
        <div className="Account">
            <Components.Container>
                <Components.SignUpContainer $signingin={$signingin}>
             
                    <SignUp/>
                </Components.SignUpContainer>

                <Components.SignInContainer $signingin={$signingin}>
             
                    <Login/>
                </Components.SignInContainer>

                <Components.OverlayContainer $signingin={$signingin}>
                    <Components.Overlay $signingin={$signingin}>
                        <Components.LeftOverlayPanel $signingin={$signingin}>
                            <Components.Title>Welcome back to Azima!</Components.Title>
                                <Components.ButtonText> To view your virtual reality tour </Components.ButtonText>
                                <Components.GhostButton onClick={() => toggle(true)}> Sign In </Components.GhostButton>
                        </Components.LeftOverlayPanel>

                        <Components.RightOverlayPanel $signingin={$signingin}>
                            <Components.Title>Welcome to Azima</Components.Title>
                            <Components.ButtonText> To create your virtual reality tour </Components.ButtonText>
                                <Components.GhostButton onClick={() => toggle(false)}> Sign Up </Components.GhostButton> 
                        </Components.RightOverlayPanel>
                    </Components.Overlay>
                </Components.OverlayContainer>

            </Components.Container>

        

        </div>
    )
}*/

import React, { useState } from "react";
import "../../css/style.css";
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
    <div className="Account">
      {
        currentForm === "login-form" ? 
          <Login onFormSwitch={toggleForm} /> : 
          <SignUp onFormSwitch={toggleForm} />
      }
    </div>
  );
}