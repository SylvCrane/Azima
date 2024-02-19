import React, {useState} from "react";
import * as Components from './Components';
import { SignUp } from "./accounts/Signup";

function App(props) {

    const [signIn, toggle] = useState(true);
     return(
        <Components.Container>
        <Components.SignUpContainer signinIn={signIn}>

            {/* CALL SIGN UP CLASS*/}
            {/*<Components.Form>
                <Components.Title>Sign Up</Components.Title>
                <Components.Input type='text' placeholder=' First Name' />
                <Components.Input type='email' placeholder='Email' />
                <Components.Input type='password' placeholder='Password' />
                <Components.Button>Sign Up</Components.Button>
            </Components.Form> */}
            <SignUp/>

            {/* CALL SIGN UP CLASS*/}
        </Components.SignUpContainer>

        <Components.SignInContainer signinIn={signIn}>
             <Components.Form>
                 <Components.Title>Sign in</Components.Title>
                 <Components.Input type='email' placeholder='Email' />
                 <Components.Input type='password' placeholder='Password' />
                 <Components.Anchor href='#'>Forgot your password?</Components.Anchor>
                 <Components.Button>Sigin In</Components.Button>
             </Components.Form>

             {/* CALL LOGIN CLASS*/}
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
                          Sigin Up
                      </Components.GhostButton> 
                </Components.RightOverlayPanel>

            </Components.Overlay>
        </Components.OverlayContainer>

    </Components.Container>
     )
}

export default App;