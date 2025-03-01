import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./src/components/css/styles.css"; 
import "./src/components/css/dark-theme.css";  
import "./src/components/css/trending.css";
import "./src/components/css/image-transitions.css";

// Create root and render app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);