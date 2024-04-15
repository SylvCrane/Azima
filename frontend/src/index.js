import React from 'react';
import { createRoot } from 'react-dom/client';
import App from "./App";
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './components/UserState';

const container = document.getElementById('root');
const root = createRoot(container); // Assuming you have a div with id='root' in your index.html

root.render(
  <React.StrictMode>
    <UserProvider>
      <BrowserRouter>
        <App /> 
      </BrowserRouter>
    </UserProvider>
  </React.StrictMode>
);