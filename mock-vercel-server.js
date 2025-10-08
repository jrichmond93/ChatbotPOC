#!/usr/bin/env node
// Simple mock server for testing Vercel serverless functions locally
// This allows testing the frontend in "Vercel mode" without Vercel CLI

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Mock conversation memory (simple in-memory storage)
const conversations = {};

// Mock chat endpoint - mimics Vercel serverless function
app.post('/api/chat', (req, res) => {
  try {
    console.log('Mock server received chat request:', req.body);
    
    const { message, sessionId, context } = req.body;
    
    // Initialize conversation if it doesn't exist
    if (!conversations[sessionId]) {
      conversations[sessionId] = {
        messages: [],
        context: {},
        messageCount: 0
      };
    }
    
    const conversation = conversations[sessionId];
    conversation.messageCount += 2; // User message + bot response
    
    // Store the message
    conversation.messages.push({
      text: message,
      sender: 'user',
      timestamp: new Date().toISOString()
    });
    
    // Generate mock response based on context and message
    let response;
    const lowerMessage = message.toLowerCase();
    
    // Check if we have stock context
    const stockSymbol = context?.stock || null;
    
    if (stockSymbol) {
      if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
        response = `The current price of ${stockSymbol} is simulated at $${(Math.random() * 200 + 50).toFixed(2)}. This is mock data for testing purposes.`;
      } else if (lowerMessage.includes('company') || lowerMessage.includes('about')) {
        response = `${stockSymbol} is a simulated stock in our mock environment. In a real implementation, this would show actual company information.`;
      } else {
        response = `I'm a mock chatbot discussing ${stockSymbol}. This simulates the Vercel serverless function behavior. Your message was: "${message}"`;
      }
    } else {
      if (lowerMessage.includes('task') || lowerMessage.includes('todo')) {
        response = `I can help you with task management! This is a mock response simulating the Vercel serverless environment. You asked: "${message}"`;
      } else if (lowerMessage.includes('investing') || lowerMessage.includes('basics')) {
        response = `Here are some investing basics (mock response): 1) Diversify your portfolio, 2) Invest for the long term, 3) Do your research. This simulates serverless function responses.`;
      } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        response = `Hello! I'm the mock chatbot running in Vercel simulation mode. How can I help you today?`;
      } else {
        response = `Mock server response: I received your message "${message}". This simulates how the Vercel serverless function would respond.`;
      }
    }
    
    // Store bot response
    conversation.messages.push({
      text: response,
      sender: 'bot',
      timestamp: new Date().toISOString()
    });
    
    // Return response in Vercel format
    res.json({
      response,
      sessionId,
      conversationSummary: `Mock conversation with ${conversation.messageCount} messages`,
      messageCount: conversation.messageCount
    });
    
  } catch (error) {
    console.error('Mock server error:', error);
    res.status(500).json({
      error: 'Mock server error',
      message: error.message,
      response: 'Sorry, there was an error in the mock server. This helps test error handling in Vercel mode.'
    });
  }
});

// Mock suggestions endpoint - mimics Vercel serverless function
app.post('/api/suggestions', (req, res) => {
  try {
    console.log('Mock server received suggestions request:', req.body);
    
    const { isFollowUp, context } = req.body;
    const stockSymbol = context?.stock || null;
    
    let suggestions;
    
    if (stockSymbol && !isFollowUp) {
      suggestions = [
        `What's ${stockSymbol}'s current trend? (Mock)`,
        `Tell me about ${stockSymbol}'s fundamentals (Mock)`,
        `How is ${stockSymbol} performing? (Mock)`
      ];
    } else if (stockSymbol && isFollowUp) {
      suggestions = [
        `What's the long-term outlook for ${stockSymbol}? (Mock)`,
        `Should I buy more ${stockSymbol}? (Mock)`,
        `What are analysts saying about ${stockSymbol}? (Mock)`
      ];
    } else if (!stockSymbol && isFollowUp) {
      suggestions = [
        "Can you explain that in more detail? (Mock)",
        "What else should I know? (Mock)",
        "How does this apply to my situation? (Mock)"
      ];
    } else {
      suggestions = [
        "Explain investing basics (Mock)",
        "How can I add a new task? (Mock)",
        "What features are available? (Mock)"
      ];
    }
    
    res.json({
      suggestions,
      context: stockSymbol ? 'stock' : 'general',
      environment: 'mock-server'
    });
    
  } catch (error) {
    console.error('Mock suggestions error:', error);
    res.status(500).json({
      error: 'Mock suggestions error',
      suggestions: ["Error loading suggestions (Mock)", "Try again (Mock)", "Check connection (Mock)"]
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: 'mock-server',
    timestamp: new Date().toISOString(),
    message: 'Mock Vercel server is running'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mock Vercel server running on http://localhost:${PORT}`);
  console.log('📡 Simulating Vercel serverless functions locally');
  console.log('🔗 Endpoints:');
  console.log(`   POST http://localhost:${PORT}/api/chat`);
  console.log(`   POST http://localhost:${PORT}/api/suggestions`);
  console.log(`   GET  http://localhost:${PORT}/api/health`);
});
