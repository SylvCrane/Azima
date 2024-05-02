import React, { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./css/style.css";
import { PopulatedNavBar } from "./components/navbar/PopulatedNavBar";
import { Tours } from "./components/pages/Tours";
import { Editor } from "./components/pages/Editor";
import { About } from "./components/pages/About";
import { SignUp } from "./components/pages/accounts/SignUp";
import { Login } from "./components/pages/accounts/Login";
import { User } from "./components/pages/accounts/User";
import { Home } from "./components/pages/Home";
import { UserProvider } from "./authentication/UserState";
import { AFrame } from "./components/pages/AFrame"; // Import the AFrame component
import { Save } from "./components/pages/Save";
import { ForgotPassword } from "./components/pages/ForgotPassword";
import { ProtectedRoute } from "./authentication/ProtectedRoute";

function App() {
  const [email, setEmail] = useState(""); // State to hold authenticated user's email
  const loggedIn = window.localStorage.getItem("isLoggedIn");
  console.log(loggedIn, "login");
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
          <Route path="/editor" element={<ProtectedRoute> <Editor /> </ProtectedRoute>} /> {/* User must be authenticated to go to this page */}
          <Route path="/account/signup" element={<SignUp setEmail={setEmail} />} />
          <Route path="/account/login" element={<Login setEmail={setEmail} />} />
          <Route path="/account/forgot-password" element={<ForgotPassword />} />
          <Route path="/account/user" element={<ProtectedRoute> <User /> </ProtectedRoute>} /> {/* User must be authenticated to go to this page */}
          <Route path="/editor/aframe" element={<ProtectedRoute><AFrame /></ProtectedRoute>} /> {/* User must be authenticated to go to this page */}
          <Route
            path="/editor/save"
            element={<ProtectedRoute><Save /></ProtectedRoute>} 
          />
        </Routes>
      </UserProvider>
    </div>
  );
}

export default App;