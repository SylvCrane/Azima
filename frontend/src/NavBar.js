import React, { useState } from "react";
import "./css/style.css";
import "./css/navbar.css";
import TextAsset from './assets/TextAsset.svg';
import AccountLogo from './assets/AzimaAccountLogo.svg';
import { Link, NavLink } from "react-router-dom";


export const Navbar = () => {

  const [menuOpen, setMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const toggleAccountMenu = () => {
    setMenuOpen(!menuOpen);
    setAccountMenuOpen(false); // Close account submenu when main menu toggles
  };

  return (
    <header className="main-header">
      <nav>
        <Link to="/" className="title">
          <img src={TextAsset} className="logo" alt="AZIMA"/>
        </Link>
        <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul className={menuOpen ? "open" : ""}>
          <li>
            <NavLink to="/home"><h3>Home</h3></NavLink>
          </li>
          <li>
            <NavLink to="/tours"><h3>Tours</h3></NavLink>
          </li>
          <li>
            <NavLink to="/editor"><h3>Editor</h3></NavLink>
          </li>
          <li>
            <NavLink to="/about"><h3>About</h3></NavLink>
          </li>
          <li>
          <div className="account-nav" onMouseEnter={toggleAccountMenu} onMouseLeave={toggleAccountMenu}>
              <Link className="account-logo" aria-label="Account">
                <img src={AccountLogo} className="logo" alt="Account" />
              </Link>
              <ul className={accountMenuOpen ? "sub-menu open" : "sub-menu"}>
                <div className=".sub-menu-content">
                <li>
                  <NavLink to="/account/login"><h3>Login</h3></NavLink>
                </li>
                <li>
                  <NavLink to="/account/signup"><h3>Sign Up</h3></NavLink>
                </li>
                </div>
                
              </ul>
            </div>
          </li>
      
        </ul>
      </nav>
    </header>
  );
};