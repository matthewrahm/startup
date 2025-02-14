import React from "react";
import { Link } from "react-router-dom";
import "/src/components/css/dark-theme.css"; 

import logoImage from "../styles/solana.png"; 
import coinPlaceholder from "../styles/solana.png"; 

function Trending() {
  const coins = [
    { name: "WebSocket", price: "$", age: "h", txns: "", volume: "$", fiveMin: "%", oneHour: "%", twentyFourHr: "%", liquidity: "$", marketCap: "$" },
    { name: "WebSocket", price: "$", age: "h", txns: "", volume: "$", fiveMin: "%", oneHour: "%", twentyFourHr: "%", liquidity: "$", marketCap: "$" },
    { name: "WebSocket", price: "$", age: "h", txns: "", volume: "$", fiveMin: "%", oneHour: "%", twentyFourHr: "%", liquidity: "$", marketCap: "$" },
    { name: "WebSocket", price: "$", age: "h", txns: "", volume: "$", fiveMin: "%", oneHour: "%", twentyFourHr: "%", liquidity: "$", marketCap: "$" },
    { name: "WebSocket", price: "$", age: "h", txns: "", volume: "$", fiveMin: "%", oneHour: "%", twentyFourHr: "%", liquidity: "$", marketCap: "$" },
  ];

  return (
    <>
      {/* Header Section */}
      <header>
        <nav className="navbar">
          <div className="logo">
            <img src={logoImage} alt="Website Logo" />
          </div>
          <div className="nav-items">
            <Link to="/">Login</Link>
            <Link to="/home">Home</Link>
            <Link to="/trending">Trending</Link>
            <Link to="/watchlist">Watchlist</Link>
            <div className="search-bar">
              <input type="text" placeholder="Search..." />
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main>
        <section className="coin-list">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Price</th>
                <th>Age</th>
                <th>TXNS</th>
                <th>Volume</th>
                <th>5m</th>
                <th>1h</th>
                <th>24h</th>
                <th>Liquidity</th>
                <th>Market Cap</th>
              </tr>
            </thead>
            <tbody>
              {coins.map((coin, index) => (
                <tr key={index}>
                  <td>
                    <img src={coinPlaceholder} alt="Coin Logo" /> {coin.name}
                  </td>
                  <td>{coin.price}</td>
                  <td>{coin.age}</td>
                  <td>{coin.txns}</td>
                  <td>{coin.volume}</td>
                  <td>{coin.fiveMin}</td>
                  <td>{coin.oneHour}</td>
                  <td>{coin.twentyFourHr}</td>
                  <td>{coin.liquidity}</td>
                  <td>{coin.marketCap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      {/* Footer Section */}
      <footer>
        <div>
          <a href="https://github.com/your-github" target="_blank" rel="noopener noreferrer" id="github-link">
            GitHub
          </a>
        </div>
      </footer>
    </>
  );
}

export default Trending;
