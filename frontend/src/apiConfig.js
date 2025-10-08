// API Configuration for both Local and Vercel environments
// Automatically switches between Flask backend and serverless functions

const API_CONFIG = {
  // Environment detection
  isLocal: process.env.REACT_APP_USE_LOCAL_BACKEND === 'true',
  isDebug: process.env.REACT_APP_DEBUG_API === 'true',
  localBaseUrl: process.env.REACT_APP_LOCAL_API_BASE_URL || 'http://localhost:5000',
  useMockServer: process.env.REACT_APP_USE_MOCK_SERVER === 'true',
  mockServerUrl: process.env.REACT_APP_MOCK_SERVER_URL || 'http://localhost:3002',
  
  // Endpoint configurations
  endpoints: {
    local: {
      chat: '/api/chatbot/message',
      suggestions: '/api/chatbot/suggestions',
      health: '/api/health'
    },
    vercel: {
      chat: '/api/chat',
      suggestions: '/api/suggestions',
      health: '/api/health'
    }
  },

  // Get the appropriate base URL
  getBaseUrl() {
    if (this.isLocal) {
      return this.localBaseUrl;
    } else if (this.useMockServer) {
      return this.mockServerUrl;
    } else {
      return ''; // Production Vercel (same domain)
    }
  },

  // Get the appropriate endpoint
  getEndpoint(type) {
    const endpoints = this.isLocal ? this.endpoints.local : this.endpoints.vercel;
    return endpoints[type];
  },

  // Get full URL for an endpoint
  getUrl(type) {
    return `${this.getBaseUrl()}${this.getEndpoint(type)}`;
  },

  // Log debug information
  debug(message, data = null) {
    if (this.isDebug) {
      console.log(`[API Debug] ${message}`, data || '');
    }
  },

  // Log API call details
  logApiCall(type, method, url, data = null) {
    if (this.isDebug) {
      console.log(`[API Call] ${method.toUpperCase()} ${type}:`, {
        url,
        environment: this.isLocal ? 'Local Flask' : 'Vercel Serverless',
        data
      });
    }
  },

  // Format request for chat endpoint
  formatChatRequest(message, sessionId, stockData) {
    if (this.isLocal) {
      return {
        message,
        sessionId,
        stockContext: stockData
      };
    } else {
      return {
        message,
        sessionId,
        context: stockData
      };
    }
  },

  // Format request for suggestions endpoint
  formatSuggestionsRequest(isFollowup, stockData, sessionId) {
    if (this.isLocal) {
      // Flask backend expects GET with query parameters
      const params = new URLSearchParams();
      
      if (stockData) {
        params.append('stock', stockData.symbol);
      }
      
      if (isFollowup) {
        params.append('followup', 'true');
      }

      if (sessionId) {
        params.append('sessionId', sessionId);
      }
      
      return {
        method: 'GET',
        url: this.getUrl('suggestions') + (params.toString() ? '?' + params.toString() : ''),
        data: null
      };
    } else {
      // Vercel expects POST with JSON data
      return {
        method: 'POST',
        url: this.getUrl('suggestions'),
        data: {
          isFollowUp: isFollowup,
          context: {
            page: stockData ? 'stocks' : 'home',
            stock: stockData?.symbol,
            sessionId: sessionId
          }
        }
      };
    }
  }
};

// Log current configuration on load
API_CONFIG.debug('API Configuration loaded:', {
  environment: API_CONFIG.isLocal ? 'Local Flask Backend' : 'Vercel Serverless',
  baseUrl: API_CONFIG.getBaseUrl(),
  endpoints: API_CONFIG.isLocal ? API_CONFIG.endpoints.local : API_CONFIG.endpoints.vercel
});

export default API_CONFIG;