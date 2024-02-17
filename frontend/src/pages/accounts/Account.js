// page that allows user to either signup or sign in.

import React from "react";
import "../../css/style.css";
import * as Components from './Components';
import { Login } from "./Login";
import { SignUp } from "./SignUp";
import {useState } from "react";

function Account() {
  const [signIn, toggle] = useState(true);
     return(
      <div className="App">
        <Components.Container>
        <Components.SignUpContainer signinIn={signIn}>
            {/* CALL SIGN UP CLASS*/}
            <SignUp/>
        </Components.SignUpContainer>

        <Components.SignInContainer signinIn={signIn}>
            {/* CALL LOGIN CLASS*/}
              <Login/>
        </Components.SignInContainer>

        <Components.OverlayContainer signinIn={signIn}>
            <Components.Overlay signinIn={signIn}>

            <Components.LeftOverlayPanel signinIn={signIn}>
                <Components.Title>Welcome back to Azima!</Components.Title>
                <Components.ButtonText>
                    To view your virtual reality tour
                </Components.ButtonText>
                <Components.GhostButton onClick={() => toggle(true)}>
                    Sign In
                </Components.GhostButton>
                </Components.LeftOverlayPanel>

                <Components.RightOverlayPanel signinIn={signIn}>
                  <Components.Title>Welcome to Azima</Components.Title>
                  <Components.ButtonText>
                      To create your virtual reality tour
                  </Components.ButtonText>
                      <Components.GhostButton onClick={() => toggle(false)}>
                          Sign Up
                      </Components.GhostButton> 
                </Components.RightOverlayPanel>

            </Components.Overlay>
        </Components.OverlayContainer>

    </Components.Container>
    </div>
    )
}

export default Account;