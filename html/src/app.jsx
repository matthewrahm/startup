import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/home';
import Trending from './pages/trending';
import Watchlist from './pages/watchlist';
import Login from './pages/login';

console.log("✅ App.jsx is running!");

function App() {
  return (
    <BrowserRouter>
      <h1 style={{ color: 'green' }}>🚀 React Router is Loaded!</h1>
      <nav>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/home">Home</NavLink>
        <NavLink to="/trending">Trending</NavLink>
        <NavLink to="/watchlist">Watchlist</NavLink>
      </nav>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/trending" element={<Trending />} />
        <Route path="/watchlist" element={<Watchlist />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
