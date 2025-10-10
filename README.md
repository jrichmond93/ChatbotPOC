# React Chatbot with External .NET API Integration

> **� External API Integration** - A sophisticated React frontend application showcasing advanced chatbot integration with external .NET APIs, featuring session management and unrelated topic limitations.

A modern **frontend-only React application** demonstrating professional chatbot implementation patterns with external API integration. This project serves as a **complete reference implementation** for developers building enterprise-grade conversational interfaces.

## 🎯 Why This Implementation Matters

This is a **production-ready architecture** that demonstrates:

- ✅ **External API Integration** with robust error handling and session management
- ✅ **Advanced UI Interactions** (draggable, resizable, persistent chat window)
- ✅ **Smart Conversation Management** with unrelated topic limitations
- ✅ **Context-Aware Responses** that adapt to stock data and user behavior
- ✅ **Professional UX Patterns** used in enterprise applications

**Perfect for developers who need to understand:**
- How to integrate React frontends with external APIs
- Advanced chatbot UI component patterns
- Session management and conversation state handling
- Responsive chat interface implementation

## 🎯 Project Overview

This application showcases a complete frontend chatbot implementation with:
- **External .NET API Integration** for intelligent responses
- **Session-based Conversation Management** with integer session IDs
- **Unrelated Topic Limitation** (max 3 per session)
- **Stock Market Context Integration** with real-time data
- **Draggable and Resizable Chat Interface** with persistent positioning
- **Professional UI/UX** with animations and responsive design

## 📁 Project Structure

```
├── frontend/                    # React frontend application
│   ├── public/
│   │   └── index.html          # Main HTML template
│   ├── src/
│   │   ├── App.js              # Main app with navigation & chat integration
│   │   ├── App.css             # Main app styling with navigation
│   │   ├── ChatBot.js          # 🤖 Advanced chatbot component with session management
│   │   ├── ChatBot.css         # Chatbot styling with animations
│   │   ├── StockTickers.js     # Stock dashboard with chat triggers
│   │   ├── StockTickers.css    # Stock table styling
│   │   ├── externalApiConfig.js # 🔧 External API configuration & request handling
│   │   ├── index.js            # React entry point
│   │   └── index.css           # Global styles
│   ├── .env.example            # Environment configuration template
│   ├── .env.local              # Local environment variables (API settings)
│   └── package.json            # Frontend dependencies
├── .github/
│   └── copilot-instructions.md # GitHub Copilot project context
├── backend/                     # � Legacy Flask backend (not used)
├── api/                        # 🚫 Legacy API files (not used) 
├── package.json                # Root scripts for frontend-only development
├── .gitignore                  # Git ignore rules
├── DEVELOPMENT.md              # Development workflow guide
├── PRE_COMMIT_CHECKLIST.md     # Pre-commit validation checklist
└── README.md                   # This comprehensive guide
```

## ✨ Key Features

### 🤖 Advanced Chatbot System
- **External .NET API Integration**: Connects to StockChatApi for intelligent responses
- **Session Management**: Integer-based session IDs with persistent conversation state
- **Unrelated Topic Limitation**: Maximum 3 unrelated topics per session
- **Context-Aware Responses**: Adapts to stock data and conversation history
- **Smart Suggestions**: Dynamic conversation prompts from API responses
- **Session Locking**: Chat becomes unavailable after topic limit is reached
- **Clean Session Reset**: New sessions start fresh with topic count = 0

### 📊 Stock Market Integration
- **Real-time Stock Data**: Simulated live price updates every 5 seconds
- **Context-Aware Chat**: Stock-specific conversations with ticker symbols
- **Interactive Dashboard**: 5 major stocks (AAPL, GOOGL, MSFT, TSLA, AMZN)
- **Stock-Specific Entry Points**: Individual chat buttons for each stock

### 🎨 Advanced UI Features
- **Draggable Interface**: Click and drag header to reposition anywhere on screen
- **Resizable Window**: Drag bottom-right corner to resize chat window
- **Minimize/Expand**: Collapse to header-only mode for space saving
- **Center Positioning**: Opens in center of screen for optimal UX
- **Responsive Design**: Mobile-friendly across all screen sizes
- **Visual Feedback**: Smooth animations, hover states, and loading indicators
- **Session Lock UI**: Clear "Chat currently unavailable" messaging when locked

### 🔧 Technical Architecture
- **Frontend-Only Design**: No backend dependencies, pure React application
- **External API Integration**: Robust API client with error handling and debugging
- **Environment Configuration**: Flexible API endpoint configuration via .env files
- **Session State Management**: Persistent chat state across page navigation
- **Component-Based Architecture**: Modular React components with clear separation

## 🚀 Prerequisites

Before running this application, make sure you have:

- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **External .NET API Access** - StockChatApi endpoint (see configuration below)

## 📦 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ChatbotPOC.git
cd ChatbotPOC
```

### 2. Install Dependencies
```bash
npm run install-deps
```

### 3. Configure External API
```bash
# Copy environment template
cp frontend/.env.example frontend/.env.local

# Edit frontend/.env.local with your API settings:
REACT_APP_EXTERNAL_API_BASE_URL=http://localhost:5280
REACT_APP_DEBUG_API=true
REACT_APP_DEFAULT_USER_ID=123
```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
```

This starts the React frontend on **http://localhost:3000**

### Alternative Start Commands
```bash
npm start           # Same as npm run dev
npm run build       # Build for production
```

## 🌐 External API Integration

This application integrates with an external .NET API (StockChatApi) for intelligent chatbot responses.

### 🔧 API Configuration

The frontend connects to your external API via environment variables:

```bash
# frontend/.env.local
REACT_APP_EXTERNAL_API_BASE_URL=http://localhost:5280
REACT_APP_DEBUG_API=true
REACT_APP_DEFAULT_USER_ID=123
```

### 📡 API Contract

**Primary Endpoint:**
- `POST /api/StockChatApi/chat` - Send message and receive intelligent response

**Request Format:**
```json
{
  "user_id": "123",
  "message": "What's the outlook for AAPL?",
  "ticker": "AAPL",
  "summary": "Previous conversation summary",
  "sessionId": 12345
}
```

**Response Format:**
```json
{
  "reply": "Apple (AAPL) has shown strong performance...",
  "summary": "Discussion about Apple stock outlook",
  "suggestedPrompts": ["What about risks?", "Compare to competitors"],
  "sessionId": 12345,
  "unrelatedTopicCount": 1
}
```

### 🔒 Session Management & Topic Limitations

- **Integer Session IDs**: API manages sessions with integer identifiers
- **Automatic Session Creation**: New sessions created when sessionId is 0 or missing
- **Topic Limitation**: Maximum 3 unrelated topics per session
- **Session Locking**: Chat becomes unavailable when limit reached
- **Clean Reset**: Closing/opening chat starts fresh session

### 📋 Frontend API Integration Example
  - **Request Body**:
    ```json
    {
      "message": "Hello, my name is John",
      "sessionId": "unique-session-id",
      "stockContext": {"symbol": "AAPL", "price": "150.25"}
    }
    ```
  - **Response Format**:
    ```json
    {
      "response": "Hello John! How can I help you today?",
      "sessionId": "unique-session-id",
      "conversationSummary": "User introduced themselves as John",
      "messageCount": 2,
      "mentionedStocks": ["AAPL"]
    }
    ```

- `GET /api/chatbot/suggestions` - Get contextual conversation suggestions
  - **Query Parameters**:
    - `sessionId=ID` - Get conversation-aware suggestions
    - `stock=SYMBOL` - Get stock-specific suggestions (e.g., `?stock=AAPL`)
    - `followup=true` - Get follow-up suggestions vs initial suggestions
  - **Response Format**:
    ```json
    {
      "suggestions": ["Question 1", "Question 2", "Question 3"],
      "context": "general" | "stock",
      "conversationContext": {
        "message_count": 4,
        "mentioned_stocks": ["AAPL"],
        "summary": "Discussion about Apple stock"
      }
    }
    ```

### 📋 Frontend API Integration Example

```javascript
// Frontend API integration with external .NET API
import API_CONFIG from './externalApiConfig';

const sendMessage = async (message, sessionId) => {
  const apiUrl = API_CONFIG.getUrl('chat');
  const requestData = API_CONFIG.formatChatRequest(
    message, userId, ticker, conversationSummary, sessionId
  );

  const response = await axios.post(apiUrl, requestData);
  const result = API_CONFIG.handleResponse(response.data);
  
  // Handle session locking
  if (result.unrelatedTopicCount >= 3) {
    setIsSessionLocked(true);
  }
  
  return result; // { reply, summary, suggestions, sessionId, unrelatedTopicCount }
};
```

## 🏗️ Component Architecture

### Key React Components

#### 🤖 ChatBot Component (`ChatBot.js`)
- **Advanced UI**: Draggable, resizable, minimizable chat interface
- **Session Management**: Integer session IDs with external API integration
- **Topic Limitations**: Prevents >3 unrelated topics per session
- **State Persistence**: Maintains chat state across page navigation
- **Context Awareness**: Stock-specific conversations with ticker integration

```javascript
const ChatBot = ({ 
  isOpen, onClose, stockData, messages, onMessagesUpdate,
  sessionId, conversationSummary, onSessionUpdate,
  position, onPositionUpdate, size, onSizeUpdate
}) => {
  const [unrelatedTopicCount, setUnrelatedTopicCount] = useState(0);
  const [isSessionLocked, setIsSessionLocked] = useState(false);
  
  // Session locking logic
  useEffect(() => {
    if (apiResult.unrelatedTopicCount >= 3) {
      setIsSessionLocked(true);
      setShowSuggestions(false);
    }
  }, [unrelatedTopicCount]);
}
```

#### 📊 StockTickers Component (`StockTickers.js`)
- **Real-time Data Simulation**: Live price updates every 5 seconds
- **Context Integration**: Stock-specific chat triggers with ticker data
- **Professional UI**: Responsive table with hover effects and animations

#### 🔧 External API Config (`externalApiConfig.js`)
- **Request Formatting**: Standardized API request structure
- **Response Handling**: Processes sessionId and unrelatedTopicCount
- **Error Management**: Robust error handling with fallback responses
- **Debug Logging**: Comprehensive request/response logging for troubleshooting

## 🔧 Development & Debugging

### Environment Variables

Configure your external API connection in `frontend/.env.local`:
```bash
REACT_APP_EXTERNAL_API_BASE_URL=http://localhost:5280
REACT_APP_DEBUG_API=true
REACT_APP_DEFAULT_USER_ID=123
```

### Debugging Features

- **Console Logging**: Set `REACT_APP_DEBUG_API=true` for detailed API logs
- **Request Tracking**: All API requests logged with timestamps and data
- **Session Monitoring**: SessionId and topic count tracking in console
- **Error Handling**: Comprehensive error messages and fallback responses

### Common Troubleshooting

1. **API Connection Issues**:
   - Verify external API is running on configured URL
   - Check CORS configuration on your .NET API
   - Review browser console for network errors

2. **Session Lock Issues**:
   - Close and reopen chat to start fresh session
   - Check console for `unrelatedTopicCount` values
   - Verify sessionId resets to 0 on chat open/close

## 🚀 Production Deployment

### Build for Production
```bash
npm run build
```

### Deployment Options
- **Static Hosting**: Vercel, Netlify, GitHub Pages
- **CDN Deployment**: AWS S3 + CloudFront
- **Container Deployment**: Docker with Nginx

### Environment Configuration
- Update `REACT_APP_EXTERNAL_API_BASE_URL` to production API URL
- Set `REACT_APP_DEBUG_API=false` for production
- Configure proper user identification system

## 📚 Related Documentation

- 📖 **[README-EXTERNAL-API.md](README-EXTERNAL-API.md)** - Detailed external API integration guide
- 📋 **[DEVELOPMENT.md](DEVELOPMENT.md)** - Development workflow and best practices
- ✅ **[PRE_COMMIT_CHECKLIST.md](PRE_COMMIT_CHECKLIST.md)** - Code quality checklist

## 🎯 Project Status

### ✅ **COMPLETED FEATURES**
- **Frontend-Only Architecture** with external .NET API integration
- **Advanced Chatbot UI** with drag/resize/minimize functionality
- **Session Management** with integer IDs and topic limitations  
- **Stock Market Integration** with context-aware conversations
- **Professional UX/UI** with responsive design and animations
- **Robust Error Handling** with comprehensive debugging tools

### 🔄 **ENHANCEMENT OPPORTUNITIES**
- Real AI API integration (replace with OpenAI, Claude, etc.)
- User authentication and persistent conversation history
- Advanced analytics dashboard for conversation insights
- Voice input/output capabilities
- Multi-language support

## 📄 License

This project is open source and available under the MIT License.

---
**🎯 A complete reference implementation for React chatbot applications with external API integration.**

## 🏗️ Chatbot Implementation Guide

### 🤖 ChatBot Component Architecture

#### Core Features Implementation
```javascript
// Key state management for chatbot functionality
const [chatbotOpen, setChatbotOpen] = useState(false);
const [chatbotStockData, setChatbotStockData] = useState(null);
const [suggestions, setSuggestions] = useState([]);
const [position, setPosition] = useState({ x: 20, y: 20 });
const [size, setSize] = useState({ width: 400, height: 500 });
```

#### Essential Functions for Replication
1. **Context Switching**: `openChatWithStock(stockData)` vs `openGeneralChat()`
2. **Suggestion Fetching**: `fetchSuggestions(isFollowup)` with API integration
3. **Drag & Drop**: Mouse event handlers for positioning
4. **Resize Logic**: Corner drag functionality with bounds checking
5. **Persistent State**: Chat stays open across page navigation

### 📊 Stock Integration Pattern
```javascript
// In StockTickers component - how to trigger contextual chat
<button onClick={() => onOpenChat(stock)} className="chat-button">
  💬
</button>

// In parent App component - state management
const openChatWithStock = (stockData) => {
  setChatbotStockData(stockData);
  setChatbotOpen(true);
};
```

### 🎨 CSS Architecture for Replication

#### Key CSS Classes
- `.chatbot-overlay` - Fixed positioning with drag support
- `.chatbot-container` - Main chat window styling
- `.chatbot-suggestions` - Dynamic suggestion display
- `.resize-handle` - Bottom-right resize functionality
- `.suggestion-button` - Interactive suggestion buttons

#### Animation System
```css
.chatbot-suggestions {
  animation: slideInUp 0.3s ease-out; /* Smooth suggestion appearance */
}

.chatbot-overlay.dragging .chatbot-container {
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.4); /* Enhanced shadow while dragging */
}
```

## 🏗️ Technical Architecture

### Frontend (React)
- **Component Structure**: Modular design with `ChatBot`, `StockTickers`, `App` components
- **State Management**: Complex state with hooks for chat persistence
- **Event Handling**: Mouse events for drag/resize, keyboard for chat input
- **API Integration**: Axios for suggestion fetching and task management
- **Responsive Design**: CSS Grid/Flexbox with mobile breakpoints

## 🔍 Chatbot Feature Walkthrough

### 1. 🚀 Opening the Chatbot
**Multiple Entry Points**:
- **Stock-Specific**: Click 💬 button next to any stock in the table
- **General Chat**: Click "💬 Start Chat with AI Assistant" on main page

### 2. 💬 Conversation Flow
1. **Initial Greeting**: Context-aware welcome message
2. **3 Smart Suggestions**: External API provides relevant conversation starters
3. **User Interaction**: Click suggestion or type custom message
4. **Bot Response**: AI response with typing indicator via external .NET API
5. **New Suggestions**: 3 fresh follow-up questions appear
6. **Continuous Flow**: Process repeats for natural conversation

### 3. 🎛️ Interactive Controls
- **Minimize**: 🔽 button collapses chat to header only
- **Drag**: Click and drag header to reposition anywhere
- **Resize**: Drag ⋰ corner to adjust window size
- **Clear**: 🗑️ button resets conversation with new suggestions
- **Close**: ✕ button closes chat completely

### 4. 📱 Cross-Page Persistence
- Chat **remains open** when switching between Task Manager and Stock Tickers
- **Maintains context** (stock-specific vs general conversation)
- **Position preserved** across page changes

## 🛠️ Developer Implementation Notes

### Key Files for Chatbot Replication
1. **`ChatBot.js`** - Main chatbot component (500+ lines)
2. **`ChatBot.css`** - Complete styling with animations (400+ lines)
3. **`externalApiConfig.js`** - External .NET API integration
4. **`App.js`** - Integration pattern with parent component

### Critical Implementation Details
- **State Lifting**: Chatbot state managed in parent `App` component
- **Event Propagation**: Careful handling of drag events vs button clicks
- **Responsive Bounds**: Viewport boundary checking for drag/resize
- **Memory Management**: Proper cleanup of global mouse event listeners

### Replication Checklist
- [x] ✅ Integrate external .NET API with context switching
- [x] ✅ Create draggable/resizable modal component
- [x] ✅ Add persistent state management across routes
- [x] ✅ Implement typing indicators and animations
- [x] ✅ Design responsive suggestion button system
- [x] ✅ Add proper error handling and loading states
- [x] ✅ **NEW**: Complete conversation memory system with personal information tracking
- [x] ✅ **NEW**: Session-based conversation persistence with contextual responses
- [x] ✅ **NEW**: Name recognition and personalized greetings
- [ ] Add conversation analytics dashboard
- [ ] Enhanced session analytics and persistence
- [ ] Add conversation export/import functionality

## 🐛 Troubleshooting & Common Issues

### Development Issues
1. **Port Conflicts**: 
   - Frontend: Set `PORT=3001` before running `npm start`
   - External API: Ensure .NET API is running on correct port

2. **Chatbot Not Appearing**: 
   - Check browser console for JavaScript errors
   - Verify chatbot state is properly lifted to App component
   - Ensure CSS z-index is sufficient (1000+)

3. **API Integration Issues**:
   - Verify external .NET API is accessible and running
   - Check `REACT_APP_EXTERNAL_API_BASE_URL` configuration
   - Review browser network tab for failed API requests

4. **Drag/Resize Issues**:
   - Ensure global mouse event listeners are properly attached
   - Check viewport bounds calculation
   - Verify event propagation isn't blocked by other elements

### Production Considerations
- **Security**: Add input sanitization for chat messages
- **Performance**: Implement message pagination for long conversations
- **Accessibility**: Add ARIA labels and keyboard navigation
- **Analytics**: Track chatbot usage patterns and popular suggestions

## 🚀 Advanced Enhancement Ideas

### For Production Implementation
1. **Real AI Integration**:
   - Replace simulated responses with OpenAI API, Claude, or similar
   - ✅ **COMPLETED**: Conversation memory and context retention system implemented
   - Implement intent recognition and entity extraction
   - Add conversation analytics and insights dashboard

2. **Enhanced Stock Features**:
   - Real stock API integration (Alpha Vantage, Yahoo Finance)
   - Live price alerts and notifications
   - Technical analysis and chart integration

3. **Advanced Chatbot Features**:
   - Voice input/output capabilities
   - Multi-language support
   - Conversation export functionality
   - Custom user preferences and settings

4. **Enterprise Features**:
   - User authentication and conversation history
   - Admin dashboard for chatbot analytics
   - Custom training data integration
   - A/B testing for suggestion effectiveness

## 📚 Learning Resources

### Key Concepts Demonstrated
- **React Hooks**: useState, useEffect, useRef for complex state management
- **Event Handling**: Mouse events, drag & drop, resize functionality
- **API Design**: RESTful endpoints with query parameters
- **CSS Animations**: Smooth transitions and user feedback
- **Responsive Design**: Mobile-first approach with breakpoints

### Recommended Reading
- [React Hook Patterns](https://reactjs.org/docs/hooks-intro.html)
- [Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
- [RESTful API Integration](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [CSS Grid and Flexbox](https://css-tricks.com/snippets/css/complete-guide-grid/)

## 🎯 Project Status & Achievements

### ✅ **FULLY IMPLEMENTED** - October 2025

This project represents a **complete, production-ready chatbot implementation** with advanced features:

#### � **Major Achievements**
- **Advanced Conversation Memory System**: Full session-based memory with personal information tracking
- **Contextual AI Responses**: Responses adapt to conversation history and user context
- **Sophisticated UI/UX**: Draggable, resizable chatbot with professional animations
- **Multi-Context Integration**: Seamless stock-specific and general conversation modes
- **Enterprise-Ready Architecture**: Clean separation of concerns with scalable API design

#### 📊 **Technical Metrics**
- **Frontend**: 500+ lines of React components with advanced state management
- **External API Integration**: .NET API with conversation memory and session management
- **UI Features**: Drag & drop, resize, persistent state, mobile responsive
- **API Communication**: RESTful design with contextual conversation support
- **Session Management**: Integer sessionId with unrelated topic count limitations

#### 🎓 **Learning Outcomes**
This implementation demonstrates:
- Advanced React patterns for complex UI interactions
- External API integration for conversational interfaces
- Session management and context retention systems
- Professional UX patterns for chatbot interfaces
- Frontend-only architecture with robust API communication

#### 🔄 **Next Steps for Production**
Ready for immediate use with optional enhancements:
- Enhanced session persistence and analytics
- Real AI API integration (OpenAI, Claude, etc.)
- Advanced conversation analytics dashboard
- User authentication and multi-user support

**Perfect for developers seeking a complete, real-world chatbot implementation pattern.**

## 📄 License

This project is open source and available under the MIT License. Feel free to use this implementation as a foundation for your own chatbot projects.

---
**🎯 Built as a comprehensive developer reference for React chatbot applications with external API integration.**

