import React, { useState } from "react";
import "./css/style.css";
import "./css/navbar.css";
import TextAsset from './TextAsset.svg';


import { Link, NavLink } from "react-router-dom";

export const Navbar = () => {

  const [menuOpen, setMenuOpen] = useState(0);

  return (

    <header class="primary-header">
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
            <NavLink to="/tours">Tours</NavLink>
          </li>
          <li>
            <NavLink to="/editor">Editor</NavLink>
          </li>
          <li>
            <NavLink to="/about">About</NavLink>
          </li>
          <li>
            <NavLink to="/account">Your Account</NavLink>
          </li>

          {/*<button>Your Account</button>*/}
        </ul>
      </nav>

    </header>
  );
};