import React from 'react';
/*import ReactDOM from 'react-dom';*/
import { createRoot } from 'react-dom/client';
import App from "./App.js";
import { BrowserRouter } from 'react-router-dom';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App /> 
    </BrowserRouter>
  </React.StrictMode>
);