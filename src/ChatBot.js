import React, { useState, useRef, useEffect, useMemo } from 'react';
import axios from 'axios';
import API_CONFIG from './externalApiConfig';
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
  
  // Unrelated topic count and session lock state
  const [unrelatedTopicCount, setUnrelatedTopicCount] = useState(0);
  const [isSessionLocked, setIsSessionLocked] = useState(false);

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
      // Reset sessionId when chat opens - API will create new session on first message
      onSessionUpdate && onSessionUpdate(0, '', false);
      
      // Reset unrelated topic count and session lock (new session starts with count = 0)
      setUnrelatedTopicCount(0);
      setIsSessionLocked(false);
      
      API_CONFIG.debug('Chat opened - sessionId and unrelatedTopicCount reset to 0');
      
      // Note: sessionId will be created by the API if missing or 0
      // We'll let the first API call establish the session
      fetchSuggestions();
    } else {
      // Reset sessionId when chat closes
      onSessionUpdate && onSessionUpdate(0, '', false);
      
      // Reset unrelated topic count and session lock
      setUnrelatedTopicCount(0);
      setIsSessionLocked(false);
      
      API_CONFIG.debug('Chat closed - sessionId and unrelatedTopicCount reset to 0');
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
      // Generate default suggestions based on context
      let defaultSuggestions = [];
      
      if (stockData && !isFollowup) {
        // Stock-specific initial suggestions
        defaultSuggestions = [
          `What's the outlook for ${stockData.symbol}?`,
          `Tell me about ${stockData.symbol}'s recent performance`,
          `What are analysts saying about ${stockData.symbol}?`
        ];
      } else if (stockData && isFollowup) {
        // Stock-specific follow-up suggestions
        defaultSuggestions = [
          `What's the long-term forecast for ${stockData.symbol}?`,
          `How does ${stockData.symbol} compare to competitors?`,
          `What are the key risks for ${stockData.symbol}?`
        ];
      } else if (!stockData && isFollowup) {
        // General follow-up suggestions
        defaultSuggestions = [
          "Can you explain that in more detail?",
          "What else should I know?",
          "How does this apply to my situation?"
        ];
      } else {
        // General initial suggestions
        defaultSuggestions = [
          "What's the market outlook today?",
          "Tell me about popular stocks",
          "What should I know about investing?"
        ];
      }
      
      setSuggestions(defaultSuggestions);
      setShowSuggestions(true);
      
      API_CONFIG.debug('Default suggestions loaded:', defaultSuggestions);
      
    } catch (error) {
      console.error('Error setting suggestions:', error);
      setSuggestions([]);
    }
  };





  const sendMessage = async (e, messageText = null) => {
    e?.preventDefault();
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim() || isSessionLocked) return;

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

    // Prepare request for external API (declare outside try block for error handling)
    const userId = process.env.REACT_APP_DEFAULT_USER_ID || '123';
    const ticker = stockData?.symbol || '';
    const apiUrl = API_CONFIG.getUrl('chat');
    const requestData = API_CONFIG.formatChatRequest(
      textToSend,
      userId,
      ticker,
      conversationSummary,
      sessionId // Pass current sessionId (null/0 will create new session)
    );

    try {

      API_CONFIG.logApiCall('chat', 'POST', apiUrl, requestData);
      API_CONFIG.debug('Session Info:', { 
        currentSessionId: sessionId, 
        willCreateNew: !sessionId || sessionId === 0 
      });

      // Send message to external API
      const response = await axios.post(apiUrl, requestData, {
        headers: {
          'Content-Type': 'application/json',
          // Add any required authentication headers here
          // 'Authorization': 'Bearer ' + process.env.REACT_APP_API_TOKEN
        }
      });

      // Handle API response
      const apiResult = API_CONFIG.handleResponse(response.data);
      API_CONFIG.debug('Session ID received:', apiResult.sessionId);
      API_CONFIG.debug('Unrelated Topic Count:', apiResult.unrelatedTopicCount);
      
      // Add bot response (always display the message)
      const botResponse = {
        id: Date.now() + 1,
        text: apiResult.reply,
        sender: 'bot',
        timestamp: new Date()
      };

      const updatedMessages = [...newMessages, botResponse];
      onMessagesUpdate && onMessagesUpdate(updatedMessages);
      setIsTyping(false);
      
      // Update unrelated topic count
      setUnrelatedTopicCount(apiResult.unrelatedTopicCount);
      
      // Lock session if unrelated topic count >= 3
      if (apiResult.unrelatedTopicCount >= 3) {
        setIsSessionLocked(true);
        setShowSuggestions(false); // Hide suggestions when locked
        API_CONFIG.debug('Session locked due to unrelated topic limit reached');
      }
      
      // Update session data with external API response
      const newConversationSummary = apiResult.summary || conversationSummary;
      const newConversationStarted = true;
      const newSessionId = apiResult.sessionId || sessionId; // Use returned sessionId or keep current
      
      onSessionUpdate && onSessionUpdate(newSessionId, newConversationSummary, newConversationStarted);
      
      // Set suggestions from external API response (only if not locked)
      if (!isSessionLocked && apiResult.suggestions && apiResult.suggestions.length > 0) {
        setSuggestions(apiResult.suggestions);
        setShowSuggestions(true);
      }

    } catch (error) {
      console.error('Error calling external API:', error);
      console.error('Request URL:', apiUrl);
      console.error('Request Data:', requestData);
      
      // Enhanced error logging for CORS and connection issues
      if (error.code === 'ERR_NETWORK') {
        console.error('❌ Network Error: Unable to reach API server');
        console.error('Check if API server is running and accessible');
      } else if (error.message?.includes('CORS')) {
        console.error('❌ CORS Error: API server needs to allow requests from this domain');
        console.error('Current domain:', window.location.origin);
      }
      
      API_CONFIG.debug('API Error Details:', {
        url: apiUrl,
        requestData,
        error: error.response?.data || error.message,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      
      // Handle error response from external API
      const errorResult = API_CONFIG.handleError(error);
      
      const fallbackResponse = {
        id: Date.now() + 1,
        text: errorResult.reply,
        sender: 'bot',
        timestamp: new Date()
      };

      const fallbackMessages = [...newMessages, fallbackResponse];
      onMessagesUpdate && onMessagesUpdate(fallbackMessages);
      
      // Set error suggestions if available
      if (errorResult.suggestions && errorResult.suggestions.length > 0) {
        setSuggestions(errorResult.suggestions);
        setShowSuggestions(true);
      }
      
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (!isSessionLocked) {
      sendMessage(null, suggestion);
    }
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
    onSessionUpdate && onSessionUpdate(0, '', false); // Reset session data with sessionId = 0
    
    // Reset unrelated topic count and session lock (new session starts with count = 0)
    setUnrelatedTopicCount(0);
    setIsSessionLocked(false);
    
    setShowSuggestions(true);
    fetchSuggestions(false); // Fetch initial suggestions when clearing
    
    API_CONFIG.debug('Chat cleared - sessionId and unrelatedTopicCount reset to 0');
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
              <h3>{isSessionLocked ? 'Chat currently unavailable' : 'AI Assistant'}</h3>
              {!isSessionLocked && stockData && !isMinimized && <span className="stock-context">Discussing {stockData.symbol}</span>}
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
            {showSuggestions && suggestions.length > 0 && !isTyping && !isSessionLocked && (
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
                      disabled={isSessionLocked}
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
                placeholder={
                  isSessionLocked 
                    ? "Chat unavailable - close and reopen to start new session" 
                    : stockData 
                      ? `Ask about ${stockData.symbol}...` 
                      : "Type your message..."
                }
                className="chatbot-input"
                disabled={isTyping || isSessionLocked}
              />
              <button type="submit" className="send-button" disabled={isTyping || !inputMessage.trim() || isSessionLocked}>
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