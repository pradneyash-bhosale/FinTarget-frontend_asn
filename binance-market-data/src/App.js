// src/App.js
import React, { useEffect, useState, useRef } from "react";
import Chart from "./components/chart";
import "./App.css";

const App = () => {
  const [selectedCoin, setSelectedCoin] = useState("ethusdt"); // Default coin
  const [interval, setInterval] = useState("1m"); // Default time interval
  const [chartData, setChartData] = useState({}); // Store data for each coin
  const ws = useRef(null); // WebSocket reference

  // UseEffect to handle WebSocket connection
  useEffect(() => {
    // Connect to WebSocket based on the selected coin and interval
    const connectWebSocket = () => {
      const url = `wss://stream.binance.com:9443/ws/${selectedCoin}@kline_${interval}`;
      ws.current = new WebSocket(url);

      ws.current.onmessage = (message) => {
        const data = JSON.parse(message.data);
        const { k: { c, h, l, o, t } } = data; // Destructure candle data

        // Create a new candle object
        const newCandle = { time: new Date(t).toLocaleTimeString(), open: o, high: h, low: l, close: c };

        // Update state with the new data
        setChartData((prevData) => {
          const updatedData = { ...prevData };
          if (!updatedData[selectedCoin]) {
            updatedData[selectedCoin] = [];
          }
          updatedData[selectedCoin].push(newCandle);
          return updatedData;
        });
      };

      return () => {
        if (ws.current) {
          ws.current.close();
        }
      };
    };

    connectWebSocket();
  }, [selectedCoin, interval]); // Rerun WebSocket setup when coin or interval changes

  // Persist data to local storage
  useEffect(() => {
    localStorage.setItem("chartData", JSON.stringify(chartData));
  }, [chartData]);

  // Retrieve historical data from local storage
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("chartData"));
    if (savedData) {
      setChartData(savedData);
    }
  }, []);

  return (
    <div className="App">
      <h1>Binance Cryptocurrency Market Data</h1>

      {/* Coin Selector */}
      <select value={selectedCoin} onChange={(e) => setSelectedCoin(e.target.value)}>
        <option value="ethusdt">ETH/USDT</option>
        <option value="bnbusdt">BNB/USDT</option>
        <option value="dotusdt">DOT/USDT</option>
      </select>

      {/* Time Interval Selector */}
      <select value={interval} onChange={(e) => setInterval(e.target.value)}>
        <option value="1m">1 Minute</option>
        <option value="3m">3 Minutes</option>
        <option value="5m">5 Minutes</option>
      </select>

      {/* Render Chart Component */}
      <Chart data={chartData[selectedCoin] || []} />
    </div>
  );
};

export default App;