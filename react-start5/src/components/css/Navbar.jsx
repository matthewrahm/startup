import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
   
    <nav>
    <a href="/home"></a>
    <a href="/trending"></a>
    <a href="/watchlist"></a>
  </nav>
  
  );
}

export default Navbar;
