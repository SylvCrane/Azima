import React from 'react';
/*import ReactDOM from 'react-dom';*/
import { createRoot } from 'react-dom/client';
import App from "./App.js";
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './components/UserState.js';
import { SessionProvider } from "next-auth/react";

const root = createRoot(document.getElementById('root'));
root.render(
  <UserProvider>
    <SessionProvider>
      <React.StrictMode>
        <BrowserRouter>
          <App /> 
        </BrowserRouter>
      </React.StrictMode>
    </SessionProvider>
  </UserProvider>
);