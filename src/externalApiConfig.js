// External API Configuration for StockChatApi
// Handles integration with external .NET API

const API_CONFIG = {
  // External API configuration with fallback protection
  baseUrl: (() => {
    let url = process.env.REACT_APP_EXTERNAL_API_BASE_URL || 
              process.env.REACT_APP_API_BASE_URL || 
              'https://chat.aistocktickers.com';
    
    // Ensure we never use placeholder URLs
    if (url.includes('your-api-domain.com')) {
      console.warn('⚠️ Detected placeholder API URL, using production fallback');
      url = 'https://chat.aistocktickers.com';
    }
    
    return url;
  })(),
  isDebug: process.env.REACT_APP_DEBUG_API === 'true',
  
  // API endpoints
  endpoints: {
    chat: '/api/StockChatApi/chat',
    health: '/api/health'
  },

  // Get full URL for an endpoint with proper path joining
  getUrl(endpoint) {
    // Clean base URL - remove trailing slashes
    const cleanBaseUrl = this.baseUrl.replace(/\/+$/, '');
    // Clean endpoint path - ensure it starts with /
    const cleanEndpoint = this.endpoints[endpoint].startsWith('/') 
      ? this.endpoints[endpoint] 
      : '/' + this.endpoints[endpoint];
    
    const fullUrl = `${cleanBaseUrl}${cleanEndpoint}`;
    this.debug(`Constructed URL for ${endpoint}:`, fullUrl);
    
    // Validate final URL
    if (fullUrl.includes('your-api-domain.com')) {
      console.error('❌ Invalid API URL detected:', fullUrl);
      throw new Error('Invalid API configuration - placeholder URL detected');
    }
    
    return fullUrl;
  },

  // Log debug information
  debug(message, data = null) {
    if (this.isDebug) {
      console.log(`[External API Debug] ${message}`, data || '');
    }
  },

  // Log API call details
  logApiCall(endpoint, method, url, requestData = null, response = null) {
    if (this.isDebug) {
      console.log(`[External API Call] ${method.toUpperCase()} ${endpoint}:`, {
        url,
        requestData,
        response: response ? 'Success' : 'Pending',
        timestamp: new Date().toISOString()
      });
    }
  },

  // Format chat request for external API
  formatChatRequest(message, userId, ticker, conversationSummary = '', sessionId = null) {
    const request = {
      user_id: userId,
      message: message,
      ticker: ticker || '', // Optional ticker symbol
      summary: conversationSummary || ''
    };

    // Add sessionId if provided (optional integer, 0 or missing creates new session)
    if (sessionId && sessionId > 0) {
      request.sessionId = sessionId;
    }

    return request;
  },

  // Handle API response
  handleResponse(response) {
    this.debug('API Response received:', response);
    
    if (response.error) {
      throw new Error(response.error.message || 'External API error');
    }
    
    return {
      reply: response.reply,
      summary: response.summary,
      suggestions: response.suggestedPrompts || [],
      sessionId: response.sessionId || null, // Extract sessionId from response
      unrelatedTopicCount: response.unrelatedTopicCount || 0 // Extract unrelated topic count
    };
  },

  // Handle API errors
  handleError(error) {
    this.debug('API Error:', error);
    
    if (error.response?.data?.error) {
      return {
        reply: `API Error: ${error.response.data.error.message}`,
        summary: error.response.data.summary || '',
        suggestions: error.response.data.suggestedPrompts || []
      };
    }
    
    return {
      reply: "I'm sorry, I'm having trouble connecting to the API right now. Please try again in a moment.",
      summary: '',
      suggestions: [
        "Try asking again",
        "Check your connection",
        "Contact support if the issue persists"
      ]
    };
  }
};

// Log configuration on load
API_CONFIG.debug('External API Configuration loaded:', {
  baseUrl: API_CONFIG.baseUrl,
  endpoints: API_CONFIG.endpoints,
  debugMode: API_CONFIG.isDebug,
  chatUrl: API_CONFIG.getUrl('chat'),
  healthUrl: API_CONFIG.getUrl('health')
});

export default API_CONFIG;