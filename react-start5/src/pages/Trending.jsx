import React from "react";
import Navbar from "./Navbar"
import { useAuth } from "../context/AuthContext";

import "/src/components/css/dark-theme.css"; 

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
      <Navbar />

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
          <a href="https://github.com/matthewrahm/startup.git" target="_blank" rel="noopener noreferrer" id="github-link">
            GitHub
          </a>
        </div>
      </footer>
    </>
  );
}

export default Trending;