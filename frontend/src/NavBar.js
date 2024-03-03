import React, { useState } from "react";
import "./css/style.css";
import "./css/navbar.css";
import TextAsset from './assets/TextAsset.svg';
import AccountLogo from './assets/AzimaAccountLogo.svg';
import { Link, NavLink } from "react-router-dom";
import { useSession, signOut } from "next-auth/react";

export const Navbar = () => {

  const { data: session } = useSession(); 

  const [menuOpen, setMenuOpen] = useState(0);

  const handleLogout = async () => {
    await signOut(); 
  }

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
          { session ? ( 
            <li>
              <div className="account-info">
                <span>{session.user.email}</span>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </li>
          ) : (
            <li>
              <NavLink to="/account" className='account-logo' aria-label="Account">
                <img src={AccountLogo} className="logo" alt="Account" />
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};