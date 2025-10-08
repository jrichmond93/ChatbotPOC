import React, { useState, useRef, useEffect, useMemo } from 'react';
import axios from 'axios';
import './ChatBot.css';

const ChatBot = ({ 
  isOpen, 
  onClose, 
  stockData = null,
  messages = [],
  onMessagesUpdate,
  sessionId = null,
  conversationSummary = '',
  conversationStarted = false,
  onSessionUpdate,
  position = null,
  onPositionUpdate,
  size = null,
  onSizeUpdate
}) => {
  // Use props for persistent state, local state for UI-only state
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Initialize messages if empty with useMemo to prevent re-renders
  const currentMessages = useMemo(() => {
    return messages.length > 0 ? messages : [
      {
        id: 1,
        text: stockData 
          ? `Hello! I can help you with information about ${stockData.symbol} (${stockData.name}). Current price is $${stockData.price}. What would you like to know?`
          : "Hello! I'm your AI assistant. I can help you with tasks, stock information, and answer questions. How can I assist you today?",
        sender: 'bot',
        timestamp: new Date()
      }
    ];
  }, [messages, stockData]);
  
  // Use props for persistent position and size, with fallbacks
  const currentPosition = position || {
    x: Math.max(20, window.innerWidth - 420),
    y: 20
  };
  const currentSize = size || { width: 400, height: 500 };
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatbotRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Initialize session and fetch suggestions when chatbot opens
  useEffect(() => {
    if (isOpen) {
      // Generate session ID if not exists
      if (!sessionId) {
        const newSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        onSessionUpdate && onSessionUpdate(newSessionId, conversationSummary, conversationStarted);
      }
      fetchSuggestions();
    }
  }, [isOpen, stockData]);

  // Update welcome message when stockData changes and we have conversation history
  useEffect(() => {
    if (stockData && conversationSummary && currentMessages.length === 1) {
      const updatedMessages = [{
        id: 1,
        text: `Hello! I can help you with information about ${stockData.symbol} (${stockData.name}). Current price is $${stockData.price}. ${conversationSummary ? `Based on our previous conversation: ${conversationSummary}.` : ''} What would you like to know?`,
        sender: 'bot',
        timestamp: new Date()
      }];
      onMessagesUpdate && onMessagesUpdate(updatedMessages);
    }
  }, [stockData, conversationSummary]);

  const fetchSuggestions = async (isFollowup = false) => {
    try {
      let url = '/api/chatbot/suggestions';
      const params = new URLSearchParams();
      
      if (stockData) {
        params.append('stock', stockData.symbol);
      }
      
      if (isFollowup || conversationStarted) {
        params.append('followup', 'true');
      }

      if (sessionId) {
        params.append('sessionId', sessionId);
      }
      
      if (params.toString()) {
        url += '?' + params.toString();
      }
      
      const response = await axios.get(url);
      setSuggestions(response.data.suggestions || []);
      setShowSuggestions(true);
      
      // Update conversation summary if provided
      if (response.data.conversationContext && response.data.conversationContext.summary) {
        const newSummary = response.data.conversationContext.summary;
        onSessionUpdate && onSessionUpdate(sessionId, newSummary, conversationStarted);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };





  const sendMessage = async (e, messageText = null) => {
    e?.preventDefault();
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date()
    };

    const newMessages = [...currentMessages, userMessage];
    onMessagesUpdate && onMessagesUpdate(newMessages);
    setInputMessage('');
    setIsTyping(true);
    setShowSuggestions(false); // Hide suggestions while processing

    try {
      // Send message to backend with conversation memory
      const response = await axios.post('/api/chatbot/message', {
        message: textToSend,
        sessionId: sessionId,
        stockContext: stockData
      });

      // Add bot response from backend
      const botResponse = {
        id: Date.now() + 1,
        text: response.data.response,
        sender: 'bot',
        timestamp: new Date()
      };

      const updatedMessages = [...newMessages, botResponse];
      onMessagesUpdate && onMessagesUpdate(updatedMessages);
      setIsTyping(false);
      
      // Update session data
      const newSessionId = response.data.sessionId || sessionId;
      const newConversationSummary = response.data.conversationSummary || conversationSummary;
      const newConversationStarted = true;
      
      onSessionUpdate && onSessionUpdate(newSessionId, newConversationSummary, newConversationStarted);
      
      // Fetch new follow-up suggestions after bot responds
      await fetchSuggestions(true);

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback to local response if API fails
      const fallbackResponse = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date()
      };

      const fallbackMessages = [...newMessages, fallbackResponse];
      onMessagesUpdate && onMessagesUpdate(fallbackMessages);
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(null, suggestion);
  };

  const clearChat = () => {
    const resetMessages = [
      {
        id: 1,
        text: stockData 
          ? `Hello! I can help you with information about ${stockData.symbol} (${stockData.name}). Current price is $${stockData.price}. What would you like to know?`
          : "Hello! I'm your AI assistant. How can I assist you today?",
        sender: 'bot',
        timestamp: new Date()
      }
    ];
    
    onMessagesUpdate && onMessagesUpdate(resetMessages);
    onSessionUpdate && onSessionUpdate(null, '', false); // Reset session data
    setShowSuggestions(true);
    fetchSuggestions(false); // Fetch initial suggestions when clearing
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Reset position on double-click
  const handleDoubleClick = () => {
    onPositionUpdate && onPositionUpdate({ x: 20, y: 20 });
    onSizeUpdate && onSizeUpdate({ width: 400, height: 500 });
  };

  // Dragging handlers
  const handleMouseDown = (e) => {
    if (e.target.closest('.chatbot-controls') || e.target.closest('.resize-handle')) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - currentPosition.x,
      y: e.clientY - currentPosition.y
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // Keep within viewport bounds
      const maxX = window.innerWidth - currentSize.width;
      const maxY = window.innerHeight - currentSize.height;
      
      const newPosition = {
        x: Math.max(0, Math.min(maxX, newX)),
        y: Math.max(0, Math.min(maxY, newY))
      };
      onPositionUpdate && onPositionUpdate(newPosition);
    }
    
    if (isResizing) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      const newWidth = Math.max(300, resizeStart.width + deltaX);
      const newHeight = Math.max(200, resizeStart.height + deltaY);
      
      // Keep within viewport bounds
      const maxWidth = window.innerWidth - currentPosition.x;
      const maxHeight = window.innerHeight - currentPosition.y;
      
      const newSize = {
        width: Math.min(maxWidth, newWidth),
        height: Math.min(maxHeight, newHeight)
      };
      onSizeUpdate && onSizeUpdate(newSize);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  // Resize handlers
  const handleResizeStart = (e) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: currentSize.width,
      height: currentSize.height
    });
  };

  // Add global mouse event listeners
  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none'; // Prevent text selection while dragging
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, isResizing, dragStart, resizeStart, currentPosition, currentSize]);

  if (!isOpen) return null;

  return (
    <div 
      className={`chatbot-overlay ${isMinimized ? 'minimized' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{
        right: 'auto',
        bottom: 'auto',
        left: `${currentPosition.x}px`,
        top: `${currentPosition.y}px`,
        width: `${currentSize.width}px`,
        height: isMinimized ? '60px' : `${currentSize.height}px`
      }}
      ref={chatbotRef}
    >
      <div className="chatbot-container">
        <div 
          className="chatbot-header"
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          title="Drag to move, double-click to reset position"
        >
          <div className="chatbot-title">
            <div className="chatbot-avatar">🤖</div>
            <div>
              <h3>AI Assistant</h3>
              {stockData && !isMinimized && <span className="stock-context">Discussing {stockData.symbol}</span>}
            </div>
          </div>
          <div className="chatbot-controls">
            {!isMinimized && (
              <button onClick={clearChat} className="clear-button" title="Clear chat">
                🗑️
              </button>
            )}
            <button onClick={toggleMinimize} className="minimize-button" title={isMinimized ? "Expand chat" : "Minimize chat"}>
              {isMinimized ? '🔼' : '🔽'}
            </button>
            <button onClick={onClose} className="close-button" title="Close chat">
              ✕
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            <div className="chatbot-messages">
              {currentMessages.map((message) => (
                <div key={message.id} className={`message ${message.sender}`}>
                  <div className="message-content">
                    <div className="message-text">{message.text}</div>
                    <div className="message-time">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="message bot typing">
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            {showSuggestions && suggestions.length > 0 && !isTyping && (
              <div className="chatbot-suggestions">
                <div className="suggestions-header">
                  {currentMessages.length === 1 ? 'Quick suggestions:' : 'Continue the conversation:'}
                  <span className="suggestions-badge">{suggestions.length}</span>
                </div>
                <div className="suggestions-list">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={`${suggestion}-${index}-${Date.now()}`}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="suggestion-button"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={sendMessage} className="chatbot-input-form">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={stockData ? `Ask about ${stockData.symbol}...` : "Type your message..."}
                className="chatbot-input"
                disabled={isTyping}
              />
              <button type="submit" className="send-button" disabled={isTyping || !inputMessage.trim()}>
                📤
              </button>
            </form>

            {/* Footer Disclaimer */}
            <div className="chatbot-footer">
              ⚠️ This isn't financial advice and AI can make mistakes.
            </div>
          </>
        )}
        
        {/* Resize Handle */}
        {!isMinimized && (
          <div 
            className="resize-handle"
            onMouseDown={handleResizeStart}
          >
            ⋰
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBot;