import React, { useState, useCallback } from 'react';
import StockTickers from './StockTickers';
import ChatBot from './ChatBot';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' or 'stocks'
  
  // Chatbot state - persistent across page changes
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [chatbotStockData, setChatbotStockData] = useState(null);
  
  // Persistent chatbot conversation state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatSessionId, setChatSessionId] = useState(null);
  const [chatConversationSummary, setChatConversationSummary] = useState('');
  const [chatConversationStarted, setChatConversationStarted] = useState(false);
  
  // Persistent chatbot UI state (position and size)
  const [chatPosition, setChatPosition] = useState(() => {
    const chatWidth = 400;
    const chatHeight = 500;
    const centerX = Math.max(20, (window.innerWidth - chatWidth) / 2);
    const centerY = Math.max(20, (window.innerHeight - chatHeight) / 2);
    return { x: centerX, y: centerY };
  });
  const [chatSize, setChatSize] = useState({ width: 400, height: 500 });

  // Chatbot functions
  const openChatWithStock = (stockData) => {
    setChatbotStockData(stockData);
    setChatbotOpen(true);
  };

  const openGeneralChat = () => {
    setChatbotStockData(null);
    setChatbotOpen(true);
  };

  const closeChatbot = () => {
    setChatbotOpen(false);
    // Keep stock data and conversation state for potential reopening
  };

  // Chatbot conversation state handlers with useCallback to prevent re-renders
  const handleChatMessagesUpdate = useCallback((newMessages) => {
    setChatMessages(newMessages);
  }, []);

  const handleChatSessionUpdate = useCallback((sessionId, conversationSummary, conversationStarted) => {
    setChatSessionId(sessionId);
    setChatConversationSummary(conversationSummary);
    setChatConversationStarted(conversationStarted);
  }, []);

  // Chatbot UI state handlers
  const handleChatPositionUpdate = useCallback((newPosition) => {
    setChatPosition(newPosition);
  }, []);

  const handleChatSizeUpdate = useCallback((newSize) => {
    setChatSize(newSize);
  }, []);

  // Render Stock Tickers page
  if (currentPage === 'stocks') {
    return (
      <div className="App">
        <nav className="app-navigation">
          <button 
            onClick={() => setCurrentPage('home')} 
            className={currentPage === 'home' ? 'nav-button active' : 'nav-button'}
          >
            🏠 Home
          </button>
          <button 
            onClick={() => setCurrentPage('stocks')} 
            className={currentPage === 'stocks' ? 'nav-button active' : 'nav-button'}
          >
            📈 Stock Tickers
          </button>
        </nav>
        <StockTickers onOpenChat={openChatWithStock} />
        
        {/* Floating Chat Button - Global Access */}
        <button 
          className="floating-chat-button"
          onClick={openGeneralChat}
          title="Open AI Assistant"
        >
          💬
        </button>
        
        {/* Chatbot - persistent across pages */}
        <ChatBot 
          isOpen={chatbotOpen}
          onClose={closeChatbot}
          stockData={chatbotStockData}
          messages={chatMessages}
          onMessagesUpdate={handleChatMessagesUpdate}
          sessionId={chatSessionId}
          conversationSummary={chatConversationSummary}
          conversationStarted={chatConversationStarted}
          onSessionUpdate={handleChatSessionUpdate}
          position={chatPosition}
          onPositionUpdate={handleChatPositionUpdate}
          size={chatSize}
          onSizeUpdate={handleChatSizeUpdate}
        />
      </div>
    );
  }

  // Render Home page
  return (
    <div className="App">
      <nav className="app-navigation">
        <button 
          onClick={() => setCurrentPage('home')} 
          className={currentPage === 'home' ? 'nav-button active' : 'nav-button'}
        >
          🏠 Home
        </button>
        <button 
          onClick={() => setCurrentPage('stocks')} 
          className={currentPage === 'stocks' ? 'nav-button active' : 'nav-button'}
        >
          📈 Stock Tickers
        </button>
      </nav>
      
      <header className="App-header">
        <h1>Stock Chat Assistant</h1>
        <p>AI-powered chatbot with real-time stock data integration</p>
      </header>

      <main className="App-main">
        {/* Start Chat Button */}
        <div className="chat-section">
          <button onClick={openGeneralChat} className="start-chat-button">
            💬 Start Chat with AI Assistant
          </button>
          <p className="chat-description">
            Ask questions about stocks, get market insights, or chat about anything!
          </p>
        </div>
      </main>
      
      {/* Floating Chat Button - Global Access */}
      <button 
        className="floating-chat-button"
        onClick={openGeneralChat}
        title="Open AI Assistant"
      >
        💬
      </button>
      
      {/* Chatbot - persistent across pages */}
      <ChatBot 
        isOpen={chatbotOpen}
        onClose={closeChatbot}
        stockData={chatbotStockData}
        messages={chatMessages}
        onMessagesUpdate={handleChatMessagesUpdate}
        sessionId={chatSessionId}
        conversationSummary={chatConversationSummary}
        conversationStarted={chatConversationStarted}
        onSessionUpdate={handleChatSessionUpdate}
        position={chatPosition}
        onPositionUpdate={handleChatPositionUpdate}
        size={chatSize}
        onSizeUpdate={handleChatSizeUpdate}
      />
    </div>
  );
}

export default App;