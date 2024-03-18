//import React, { useState } from "react";
import "../../css/style.css";
import "../../css/navbar.css";
import TextAsset from '../../assets/TextAsset.svg';
import { useUser } from "../UserState";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import NavBarItem from "./NavBarItem";
import NavBarDropdown from "./NavBarDropdown";

export const PopulatedNavBar = () => {
  const userState = useUser(); 
  const redirect = useNavigate();
  const [user, setUser] = userState; 


 
  const handleLogout = () => {
    setUser({
      isAuthenticated: false, 
      email: undefined, 
      password: undefined,
    });
    redirect("/");
  };

  const AuthenticatedNavBar = () => {
    if (user.isAuthenticated) {
      return (
        <NavBarItem dropdown="/account">
          <h3>Account</h3>
          {user.email}
          <NavBarDropdown>
          <button onClick={handleLogout}>Logout</button>
          </NavBarDropdown>
        </NavBarItem>
      );
    }
    return null;
  };

  return (
    <NavBar>
      <NavBarItem route="/"><img src={TextAsset} className="logo" alt="AZIMA"/></NavBarItem>
      <NavBarItem route="/home"><h3>Home</h3></NavBarItem>
      <NavBarItem route="/tours"><h3>Tours</h3></NavBarItem>


        <NavBarItem route="/editor"><h3>Editor</h3></NavBarItem>
 
    
      <NavBarItem route="/about"><h3>About</h3></NavBarItem>

      {AuthenticatedNavBar()}
      
      {!user.isAuthenticated && (
        <NavBarItem dropdown="/account">
          <h3>Account</h3>
          <NavBarDropdown>
            <NavBarItem route="/account/login"> 
              <h3>Login</h3>
            </NavBarItem>
            <NavBarItem route="/account/signup">
              <h3>Sign Up</h3>
            </NavBarItem>
          </NavBarDropdown>
        </NavBarItem>
      )}
    </NavBar>
  );
};