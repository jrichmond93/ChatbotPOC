import React, { useState, useEffect } from 'react';
import './StockTickers.css';

const StockTickers = ({ onOpenChat }) => {
  const [stocks, setStocks] = useState([
    { symbol: 'AAPL', name: 'Apple Inc.', price: 150.25, change: '+2.34', changePercent: '+1.58%', volume: '45.2M' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2750.80, change: '-15.20', changePercent: '-0.55%', volume: '1.8M' },
    { symbol: 'MSFT', name: 'Microsoft Corporation', price: 330.59, change: '+5.67', changePercent: '+1.74%', volume: '28.9M' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 245.12, change: '-8.45', changePercent: '-3.33%', volume: '52.1M' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 3285.04, change: '+12.88', changePercent: '+0.39%', volume: '3.7M' }
  ]);

  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prevStocks => 
        prevStocks.map(stock => {
          const randomChange = (Math.random() - 0.5) * 10; // Random change between -5 and +5
          const newPrice = Math.max(stock.price + randomChange, 0.01);
          const priceChange = newPrice - stock.price;
          const percentChange = ((priceChange / stock.price) * 100);
          
          return {
            ...stock,
            price: Number(newPrice.toFixed(2)),
            change: priceChange >= 0 ? `+${priceChange.toFixed(2)}` : priceChange.toFixed(2),
            changePercent: percentChange >= 0 ? `+${percentChange.toFixed(2)}%` : `${percentChange.toFixed(2)}%`
          };
        })
      );
      setLastUpdate(new Date());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const getChangeClass = (change) => {
    if (change.startsWith('+')) return 'positive';
    if (change.startsWith('-')) return 'negative';
    return 'neutral';
  };

  const refreshData = () => {
    // Simulate a manual refresh with random price changes
    setStocks(prevStocks => 
      prevStocks.map(stock => {
        const randomChange = (Math.random() - 0.5) * 20; // Larger change for manual refresh
        const newPrice = Math.max(stock.price + randomChange, 0.01);
        const priceChange = newPrice - stock.price;
        const percentChange = ((priceChange / stock.price) * 100);
        
        return {
          ...stock,
          price: Number(newPrice.toFixed(2)),
          change: priceChange >= 0 ? `+${priceChange.toFixed(2)}` : priceChange.toFixed(2),
          changePercent: percentChange >= 0 ? `+${percentChange.toFixed(2)}%` : `${percentChange.toFixed(2)}%`
        };
      })
    );
    setLastUpdate(new Date());
  };

  return (
    <div className="stock-tickers">
      <div className="stock-header">
        <h1>Stock Market Dashboard</h1>
        <div className="header-controls">
          <button onClick={refreshData} className="refresh-button">
            🔄 Refresh
          </button>
          <div className="last-update">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div className="stock-table-container">
        <table className="stock-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Company Name</th>
              <th>Price ($)</th>
              <th>Change ($)</th>
              <th>Change (%)</th>
              <th>Volume</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock, index) => (
              <tr key={stock.symbol} className="stock-row">
                <td className="symbol-cell">
                  <strong>{stock.symbol}</strong>
                </td>
                <td className="name-cell">{stock.name}</td>
                <td className="price-cell">
                  ${stock.price.toLocaleString()}
                </td>
                <td className={`change-cell ${getChangeClass(stock.change)}`}>
                  {stock.change}
                </td>
                <td className={`change-percent-cell ${getChangeClass(stock.changePercent)}`}>
                  {stock.changePercent}
                </td>
                <td className="volume-cell">{stock.volume}</td>
                <td className="actions-cell">
                  <button 
                    onClick={() => onOpenChat(stock)}
                    className="chat-button"
                    title={`Chat about ${stock.symbol}`}
                  >
                    💬
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="stock-info">
        <p className="disclaimer">
          📊 <strong>Note:</strong> This is a demo application with simulated stock data. 
          Prices update every 5 seconds for demonstration purposes. 
          For real trading, please use actual financial data providers.
        </p>
      </div>
    </div>
  );
};

export default StockTickers;