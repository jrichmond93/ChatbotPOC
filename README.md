# Full-Stack React + Python Application with Advanced Chatbot

> **🎯 Developer Reference Implementation** - A comprehensive example showcasing advanced chatbot integration patterns, drag-and-drop interfaces, and context-aware conversation systems.

A modern full-stack web application demonstrating sophisticated chatbot integration with React frontend and Python Flask backend. This project serves as a **complete implementation guide** for developers looking to build enterprise-grade chatbot features in their applications.

## 🎯 Why This Implementation Matters

This isn't just another chatbot demo - it's a **production-ready pattern** that demonstrates:

- ✅ **Context-aware conversations** that adapt to user actions
- ✅ **Advanced UI interactions** (draggable, resizable, persistent)
- ✅ **Smart suggestion systems** powered by backend APIs  
- ✅ **Cross-page state management** without complex routing
- ✅ **Professional UX patterns** used in enterprise applications

**Perfect for developers who need to understand:**
- How to integrate chatbots into existing applications
- Modern React patterns for complex UI components
- Backend API design for conversational interfaces
- Mobile-responsive chat implementations

## 🎯 Project Overview

This application showcases a complete chatbot implementation with:
- **Context-aware conversations** (general + stock-specific)
- **Dynamic suggestion system** with backend API integration
- **Draggable and resizable chat interface**
- **Persistent chat state** across page navigation
- **Professional UI/UX** with animations and responsive design

## 📁 Project Structure

```
├── frontend/                    # React frontend application
│   ├── public/
│   │   └── index.html          # Main HTML template
│   ├── src/
│   │   ├── App.js              # Main app with navigation & chat integration
│   │   ├── App.css             # Main app styling with navigation
│   │   ├── ChatBot.js          # 🤖 Advanced chatbot component
│   │   ├── ChatBot.css         # Chatbot styling with animations
│   │   ├── StockTickers.js     # Stock dashboard with chat triggers
│   │   ├── StockTickers.css    # Stock table styling
│   │   ├── index.js            # React entry point
│   │   └── index.css           # Global styles
│   └── package.json            # Frontend dependencies
├── backend/                     # Python Flask backend
│   ├── app.py                  # Flask API with chatbot routes
│   ├── requirements.txt        # Python dependencies
│   └── .env                    # Environment variables
├── .github/
│   └── copilot-instructions.md # Project setup instructions
├── package.json                # Root scripts for development
├── .gitignore                  # Git ignore rules
└── README.md                   # This comprehensive guide
```

## ✨ Key Features

### 🤖 Advanced Chatbot System
- **Conversation Memory**: Full session-based memory with personal information tracking
- **Name Recognition**: Automatically detects and remembers user names from natural language
- **Contextual Responses**: Adapts responses based on conversation history and user context
- **Multiple Entry Points**: Chat buttons on stock rows + main page button
- **Context Awareness**: Different behavior for general vs stock-specific conversations
- **Dynamic Suggestions**: 3 random suggestions after each bot response
- **Persistent State**: Chat remains open when switching between pages
- **Smart Conversation Flow**: Initial vs follow-up suggestion pools
- **Session Management**: Unique session IDs with persistent conversation state

### 📊 Stock Market Dashboard
- **Real-time Simulation**: Prices update every 5 seconds
- **Interactive Table**: 5 major stocks (AAPL, GOOGL, MSFT, TSLA, AMZN)
- **Individual Chat Access**: Chat button for each stock with context
- **Professional Styling**: Responsive design with hover effects

### 🎨 User Interface Features
- **Draggable Chatbot**: Click and drag header to reposition
- **Resizable Window**: Drag bottom-right corner to resize
- **Minimize/Expand**: Collapse to header-only mode
- **Responsive Design**: Mobile-friendly across all screen sizes
- **Visual Feedback**: Animations, hover states, and loading indicators

### 🔧 Technical Architecture
- **Component-Based**: Modular React components with clear separation
- **State Management**: React hooks for complex state handling
- **API Integration**: Axios for HTTP requests with error handling
- **Real-time Updates**: Simulated live data with automatic refresh

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 14 or higher) - [Download here](https://nodejs.org/)
- **Python** (version 3.7 or higher) - [Download here](https://python.org/)
- **npm** (comes with Node.js)

## Installation

### 1. Install Root Dependencies
```bash
npm install
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

### 3. Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
cd ..
```

Alternatively, you can install all dependencies at once:
```bash
npm run install-all
```

## Running the Application

> **🎯 Smart Environment System**: This app features an intelligent environment management system that automatically switches between local Flask backend and Vercel serverless functions based on configuration. This allows you to test both development and production scenarios locally.

### 🏠 Local Development Environments

#### **Option 1: Full Local Development (Recommended)**
Run with complete Flask backend for full feature testing:

```bash
npm run dev:local
```

**What this does:**
- ✅ Sets environment to local Flask backend mode
- ✅ Starts Flask server on `http://localhost:5000`  
- ✅ Starts React frontend on `http://localhost:3001`
- ✅ Enables full conversation memory persistence
- ✅ Shows green "Local Flask" environment indicator

**Use this for:**
- ✅ Complete feature development and testing
- ✅ Full conversation memory across messages
- ✅ Real-time debugging and development
- ✅ All advanced chatbot features working

#### **Option 2: Mock Vercel Environment Testing**
Test production deployment behavior locally:

```bash
npm run dev:vercel-mock
```

**What this does:**
- ✅ Sets environment to Vercel serverless mode
- ✅ Starts mock server on `http://localhost:3002` (simulates Vercel functions)
- ✅ Starts React frontend on `http://localhost:3001`
- ✅ Shows blue "Mock Server" environment indicator
- ⚠️ Simulates serverless function behavior (no persistent memory)

**Use this for:**
- 🧪 Testing how the app behaves in production
- 🧪 Verifying API endpoint compatibility
- 🧪 UI/UX testing without full backend features
- 🧪 Deployment troubleshooting

#### **Option 3: Manual Environment Control**
For advanced developers who want granular control:

```bash
# Check current environment
npm run env:show

# Switch environments manually
npm run env:local    # Switch to Flask backend
npm run env:vercel   # Switch to Vercel mode  
npm run env:mock     # Switch to mock server mode

# Then start servers manually
npm run server       # Start Flask backend only
npm run client       # Start React frontend only
npm run dev         # Use current environment settings
```

