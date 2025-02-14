import React from 'react';
import ReactDOM from 'react-dom';
import App from './src/app'; 

console.log("✅ index.jsx is running!");

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
