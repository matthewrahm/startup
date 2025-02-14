import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/trending">Trending</Link></li>
        <li><Link to="/watchlist">Watchlist</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
