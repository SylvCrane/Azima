// Import statements for styles, assets, React hooks, and components
import "../../css/style.css";
import "../../css/navbar.css";
import TextAsset from '../../assets/TextAsset.svg';
import AccountLogo from '../../assets/AzimaAccountLogo.svg';
import { useState } from "react";
import { useNavigate, NavLink, Link } from "react-router-dom";
import { useUser } from "../../authentication/UserState";
import NavBar from "./NavBar";
import React from "react";

// PopulatedNavBar component definition
export const PopulatedNavBar = () => {
  // State variables using React hooks
  const userState = useUser(); 
  const redirect = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // State variable for hamburger menu
  const [buttonOpen, setButtonOpen] = useState(false); // State variable for the dropdwon menu
  const [user, setUser] = userState; 

  // Function to handle user logout and initializing the state of the user
  const handleLogout = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("isLoggedIn");
    window.localStorage.removeItem("userEmail");
    setUser({
    
      isAuthenticated: false,
    });
    redirect("/");
  };

  // Function to toggle hamburger menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Function to close hamburger menu
  const closeMenu = () => {
    setMenuOpen(false);
  };

  const toggleDropdown = () => {
    setButtonOpen(!buttonOpen);
  };
  
  // JSX code for the PopulatedNavBar component
  return (
    <NavBar>
      <Link to ="/"><img src={TextAsset} className="azima-logo" onClick={closeMenu} alt="AZIMA"/></Link>
      <div className="menu" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
      </div>
      
      <ul className={menuOpen ? "open" : ""}>
        <li><NavLink to ="/home"><h3>Home</h3></NavLink></li>
        <li><NavLink to ="/tours"><h3>Tours</h3></NavLink></li>

        {/* Editor page will appear when user logs in */}
        {user?.isAuthenticated && (
          <li><NavLink to ="/editor"><h3>Editor</h3></NavLink></li>
        )}

        <li><NavLink to ="/about"><h3>About</h3></NavLink></li>

        {/* When user is not logged in */}
        {!user?.isAuthenticated && (
            <li>
              <div className="account-dropdown">
                <button className="account-button" onClick={toggleDropdown}>
                  <h3 className="account-image"> 
                    <img src={AccountLogo} className="account-logo" alt="Account" />
                  </h3>
                </button>
                <div className="dropdown-content">
                  <NavLink to="/account/login" className="dropdown-link">
                    <h4>Sign In</h4>
                  </NavLink>
                  <NavLink to="/account/signup" className="dropdown-link">
                    <h4>Sign Up</h4>
                  </NavLink>
                </div>
              </div>
            </li>
        )}

        {/* When user is logged in */}
        {user?.isAuthenticated && (
          <li>
            <div className="account-dropdown">
              <div className="profile-image-section" style={{marginTop: '2px', justifyContent: 'center', alignItems: 'center', width: '50px', height: '45px'}}>
                <div className="profile-image-container" style={{justifyContent: 'center', alignItems: 'center', width: '36px', height: '36px'}}>
                <img className="profile-image" src={user.profileImage || AccountLogo} alt="Profile" />
                </div>
              </div>
              <div className="dropdown-content">
                <NavLink to="/account" className="dropdown-link">
                  <div>
                      {/* Will display both the user email and username in one div/navlink */}
                      <h4>{user.firstName} {user.lastName}</h4>
                  </div>
                </NavLink>
                <button className="logout-btn" onClick={handleLogout}>Log Out</button>
              </div>
            </div>
          </li>
        )}
      </ul>
    </NavBar>
  );
};