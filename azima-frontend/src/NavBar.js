import React, { useState } from "react";
import "./css/style.css";
import "./css/navbar.css";
import TextAsset from './assets/TextAsset.svg';
import AccountLogo from './assets/AzimaAccountLogo.svg';
import { Link, NavLink } from "react-router-dom";

export const Navbar = () => {

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="main-header">
      <nav>
        <Link to="/" className="title" onClick={closeMenu}>
          <img src={TextAsset} className="logo" alt="AZIMA"/>
        </Link>
        <div className="menu" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul className={menuOpen ? "open" : ""}>
          <li>
            <NavLink to="/home" onClick={closeMenu}><h3>Home</h3></NavLink>
          </li>
          <li>
            <NavLink to="/tours" onClick={closeMenu}><h3>Tours</h3></NavLink>
          </li>
          <li>
            <NavLink to="/editor" onClick={closeMenu}><h3>Editor</h3></NavLink>
          </li>
          <li>
            <NavLink to="/about" onClick={closeMenu}><h3>About</h3></NavLink>
          </li>
          <li>
            <Link className="account-link" aria-label="Account" onClick={toggleMenu}>
              <img src={AccountLogo} onClick={closeMenu} className="logo" alt="Account"  />
            </Link>
            <div className={`dropdown-menu ${menuOpen ? 'open' : ''}`}>
              <ul>
                <Link to="/account/signup"><h4>Sign Up</h4></Link>
              </ul>
              <ul>
                <Link to="/account/login"><h4>Login</h4></Link>
              </ul>
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
};