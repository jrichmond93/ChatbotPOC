# Frontend-Only React Application with External .NET API

> **🌐 External API Integration** - React frontend application that integrates with external StockChatApi for intelligent stock market conversations.

## 🎯 Application Overview

This is a **frontend-only React application** that provides an advanced chatbot interface integrated with an external .NET API for stock market insights and conversations.

### ✨ Key Features
- 🤖 **Advanced Chatbot Interface** - Draggable, resizable, and persistent chat window
- 📊 **Stock Market Integration** - Context-aware conversations about specific stocks
- 🔄 **Real-time API Integration** - Connects to external StockChatApi endpoint
- 💡 **Smart Suggestions** - Dynamic conversation prompts based on API responses
- 🎨 **Professional UI/UX** - Enterprise-grade interface with animations

## 🚀 Getting Started

### Prerequisites
- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)
- **External API Access** - StockChatApi endpoint URL and credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ChatbotPOC.git
   cd ChatbotPOC
   ```

2. **Install dependencies**
   ```bash
   npm run install-deps
   ```

3. **Configure API connection**
   ```bash
   # Copy environment template
   cp frontend/.env.example frontend/.env.local
   
   # Edit frontend/.env.local with your API details:
   REACT_APP_EXTERNAL_API_BASE_URL=https://your-api-domain.com
   REACT_APP_DEFAULT_USER_ID=your-user-id
   ```

4. **Start the application**
   ```bash
   npm start
   ```

   Application will open at `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Create `frontend/.env.local` with the following configuration:

```bash
# External API Configuration
REACT_APP_USE_EXTERNAL_API=true
REACT_APP_EXTERNAL_API_BASE_URL=https://your-api-domain.com
REACT_APP_DEBUG_API=true

# User Configuration  
REACT_APP_DEFAULT_USER_ID=123

# Optional: API Authentication
# REACT_APP_API_TOKEN=your-api-token-here
```

### API Integration Details

The application integrates with the **StockChatApi** using the following format:

#### **Request Format (POST /api/StockChatApi/chat)**
```json
{
  "user_id": "123",
  "message": "What's TSLA's outlook?",
  "ticker": "TSLA",
  "summary": "Previous conversation summary..."
}
```

#### **Success Response**
```json
{
  "reply": "AI response about TSLA outlook...",
  "summary": "Updated conversation summary (50-100 words)",
  "suggestedPrompts": [
    "What are the latest news for TSLA?",
    "How does TSLA compare to other EV stocks?",
    "What is the analyst consensus on TSLA?"
  ]
}
```

#### **Error Response**
```json
{
  "error": {
    "code": "INTERNAL_ERROR", 
    "message": "Error description"
  },
  "summary": "",
  "suggestedPrompts": []
}
```

## 📊 Features & Usage

### 🤖 **Advanced Chatbot**
- **Drag & Drop**: Click and drag the chat header to reposition
- **Resize**: Drag the bottom-right corner to resize the chat window
- **Minimize**: Click minimize button to collapse to header only
- **Persistence**: Chat remains open when navigating between pages

### 📈 **Stock Integration**
- **Stock Dashboard**: Interactive table with real-time price simulation
- **Context-Aware Chat**: Click stock ticker buttons for stock-specific conversations
- **Ticker Integration**: Automatic ticker symbol detection for relevant responses

### 💬 **Conversation Features**
- **Smart Suggestions**: Dynamic prompts based on API responses
- **Context Retention**: Conversation summary maintained across messages
- **User Identification**: Persistent user ID for personalized responses

## 🎨 User Interface

### **Environment Indicator**
The application displays a visual indicator in the top-right corner:
- 🌐 **"External API"** - Connected to external StockChatApi

### **Chat Interface**
- **Modern Design**: Clean, professional interface
- **Responsive**: Works on desktop, tablet, and mobile devices
- **Animations**: Smooth transitions and loading states
- **Accessibility**: Keyboard navigation and screen reader support

## 🛠 Development

### **Available Scripts**

```bash
npm start          # Start development server (http://localhost:3000)
npm run build      # Build for production
npm run test       # Run tests
npm run install-deps  # Install all dependencies
npm run env:show   # Show current configuration
```

### **Project Structure**

```
frontend/
├── src/
│   ├── App.js                    # Main application component
│   ├── ChatBot.js               # Advanced chatbot component  
│   ├── StockTickers.js          # Stock dashboard component
│   ├── externalApiConfig.js     # API integration configuration
│   ├── App.css                 # Main application styling
│   ├── ChatBot.css             # Chatbot styling with animations
│   └── StockTickers.css        # Stock dashboard styling
├── public/
│   └── index.html              # HTML template
├── .env.local                  # Environment configuration
├── .env.example               # Environment template
└── package.json               # Dependencies and scripts
```

### **API Configuration**

The `externalApiConfig.js` file handles all API interactions:

```javascript
// Example usage
const response = await axios.post(API_CONFIG.getUrl('chat'), 
  API_CONFIG.formatChatRequest(message, userId, ticker, summary)
);

const result = API_CONFIG.handleResponse(response.data);
// result.reply, result.summary, result.suggestions
```

## 🔐 Security Considerations

- **API Keys**: Store sensitive credentials in environment variables
- **CORS**: Ensure external API allows requests from your domain
- **Authentication**: Add proper authentication headers if required
- **Error Handling**: Graceful handling of API failures and network issues

## 🚀 Deployment

### **Production Build**
```bash
npm run build
```

### **Deploy to Static Hosting**
The built application can be deployed to any static hosting service:
- **Vercel**: `npx vercel --prod`
- **Netlify**: Drag and drop `build/` folder
- **GitHub Pages**: Use `gh-pages` package
- **AWS S3**: Upload `build/` contents to S3 bucket

### **Environment Variables for Production**
Set these in your hosting platform:
```bash
REACT_APP_EXTERNAL_API_BASE_URL=https://your-production-api.com
REACT_APP_DEFAULT_USER_ID=production-user-id
REACT_APP_DEBUG_API=false
```

## 🐛 Troubleshooting

### **API Connection Issues**
```bash
# Check API configuration
npm run env:show

# Verify API endpoint is reachable
curl -X POST https://your-api-domain.com/api/StockChatApi/chat \
  -H "Content-Type: application/json" \
  -d '{"user_id":"test","message":"hello","ticker":"","summary":""}'
```

### **CORS Errors**
- Ensure your external API allows requests from your domain
- Add proper CORS headers on the API server
- For development, API should allow `http://localhost:3000`

### **Build Issues**
```bash
# Clear cache and reinstall
rm -rf node_modules frontend/node_modules
rm package-lock.json frontend/package-lock.json
npm run install-deps
```

## 🤝 API Requirements

Your external StockChatApi should:
- ✅ Accept POST requests to `/api/StockChatApi/chat`
- ✅ Return responses in the specified JSON format
- ✅ Handle CORS for frontend domain
- ✅ Support optional ticker parameter for stock-specific queries
- ✅ Provide meaningful error responses

## 📋 Next Steps

1. **Configure API endpoint** in `.env.local`
2. **Test API connection** with sample requests
3. **Customize styling** to match your brand
4. **Add authentication** if required by your API
5. **Deploy to production** hosting platform

This frontend application provides a complete, production-ready interface for your StockChatApi! 🚀