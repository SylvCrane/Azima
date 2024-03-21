import React, { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./css/style.css";
import { PopulatedNavBar } from "./components/navbar/PopulatedNavBar";
import { Tours } from "./components/pages/Tours";
import { Editor } from "./components/pages/Editor";
import { About } from "./components/pages/About";
import { Account } from "./components/pages/accounts/Account";
import { SignUp } from "./components/pages/accounts/SignUp";
import { Login } from "./components/pages/accounts/Login";
import { Home } from "./components/pages/Home";
import { UserProvider } from "./components/UserState";
import { AFrame } from "./components/pages/AFrame"; // Import the AFrame component

function App() {
  const [email, setEmail] = useState(""); // State to hold authenticated user's email
  const location = useLocation();

  const shouldHideNavbar = (pathname) => {
    return pathname.startsWith("/editor/aframe");
  };

  return (
    <div className="App">
      <UserProvider>
        {!shouldHideNavbar(location.pathname) && <PopulatedNavBar userEmail={email} />}{/* Pass userEmail to PopulatedNavBar */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/about" element={<About />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/account" element={<Account />} />
          <Route
            path="/account/signup"
            element={<SignUp setEmail={setEmail} />} 
          />
          <Route
            path="/account/login"
            element={<Login setEmail={setEmail} />} 
          />
       
          <Route
            path="/editor/aframe"
            element={<AFrame />} 
          />
        </Routes>
      </UserProvider>
    </div>
  );
}

export default App;