# Environment Configuration System

This project includes an intelligent environment configuration system that automatically switches between local Flask backend and Vercel serverless functions.

## 🎯 Quick Start

### Local Development (Flask Backend)
```bash
npm run dev:local      # Sets local config + starts both servers
# OR manually:
npm run env:local      # Switch to local config
npm run dev           # Start both React + Flask servers
```

### Vercel Testing (Serverless Functions)
```bash
npm run dev:vercel     # Sets Vercel config + starts React only
# OR manually:
npm run env:vercel     # Switch to Vercel config  
npm run client        # Start React only (uses /api/* routes)
```

### Check Current Environment
```bash
npm run env:show       # Display current configuration
```

## 🔧 How It Works

### Environment Detection
The app automatically detects which backend to use based on environment variables:

- **Local Development**: Uses Flask backend at `http://localhost:5000`
- **Vercel Production**: Uses serverless functions at `/api/*` routes

### Configuration Files

#### `.env.local` (Local Development)
```env
REACT_APP_USE_LOCAL_BACKEND=true
REACT_APP_LOCAL_API_BASE_URL=http://localhost:5000
REACT_APP_DEBUG_API=true
```

#### `.env.production` (Vercel Deployment)
```env
REACT_APP_USE_LOCAL_BACKEND=false
REACT_APP_DEBUG_API=false
```

### API Endpoint Mapping

| Feature | Local (Flask) | Vercel (Serverless) |
|---------|---------------|-------------------|
| **Chat** | `POST /api/chatbot/message` | `POST /api/chat` |
| **Suggestions** | `GET /api/chatbot/suggestions?params` | `POST /api/suggestions` |
| **Request Format** | `{stockContext: data}` | `{context: data}` |
| **Method** | GET + Query params | POST + JSON body |

## 🎨 Visual Indicators

The app includes a visual environment indicator in the top-right corner:

- 🟢 **Green**: Local Flask Backend  
- 🔵 **Blue**: Vercel Serverless  
- **Debug Mode**: Shows when API debugging is enabled

## 📝 Environment Switching

### Using Scripts (Recommended)
```bash
# Switch to local Flask backend
npm run env:local

# Switch to Vercel serverless
npm run env:vercel

# Show current configuration
npm run env:show
```

### Using Shell Script Directly
```bash
# Make executable (first time only)
chmod +x switch-env.sh

# Switch environments
./switch-env.sh local      # or 'l'
./switch-env.sh vercel     # or 'v' 
./switch-env.sh show       # or 's'
./switch-env.sh remove     # Remove config (use Vercel default)
```

### Manual Configuration
Create `frontend/.env.local` with your preferred settings:

```env
# For local development
REACT_APP_USE_LOCAL_BACKEND=true
REACT_APP_LOCAL_API_BASE_URL=http://localhost:5000
REACT_APP_DEBUG_API=true

# For Vercel testing
REACT_APP_USE_LOCAL_BACKEND=false
REACT_APP_DEBUG_API=false
```

## 🚀 Deployment Workflow

### Development Phase
```bash
npm run dev:local          # Work with full Flask backend
```

### Testing Vercel Functions Locally
```bash
npm run dev:vercel         # Test serverless behavior
vercel dev                # Test with Vercel CLI (optional)
```

### Production Deployment
```bash
# No configuration needed - uses .env.production automatically
git push                  # Auto-deploy via Vercel GitHub integration
# OR
vercel --prod            # Manual deployment
```

## 🛠 Configuration API

### `apiConfig.js` Methods

```javascript
import API_CONFIG from './apiConfig';

// Environment detection
API_CONFIG.isLocal         // true for Flask, false for Vercel
API_CONFIG.isDebug         // true when debugging enabled

// URL generation
API_CONFIG.getUrl('chat')         // Full URL for chat endpoint
API_CONFIG.getUrl('suggestions')  // Full URL for suggestions

// Request formatting
API_CONFIG.formatChatRequest(message, sessionId, stockData)
API_CONFIG.formatSuggestionsRequest(isFollowup, stockData, sessionId)

// Debug logging
API_CONFIG.debug('Message', data)
API_CONFIG.logApiCall('chat', 'POST', url, requestData)
```

## 🔍 Debugging

### Enable Debug Mode
Set `REACT_APP_DEBUG_API=true` in your `.env.local` file.

### Debug Output
When debug mode is enabled, you'll see detailed logs:
```
[API Debug] API Configuration loaded: {environment: "Local Flask Backend", ...}
[API Call] POST chat: {url: "http://localhost:5000/api/chatbot/message", ...}
```

### Browser Console
Check browser console for:
- Environment configuration on app load
- API call details with URLs and payloads
- Error details with request information

## 🚨 Troubleshooting

### "Connection Error" Messages
1. **Check Environment**: Run `npm run env:show`
2. **Local Mode**: Ensure Flask backend is running (`python backend/app.py`)
3. **Vercel Mode**: Check if using correct serverless endpoints
4. **Debug Mode**: Enable with `REACT_APP_DEBUG_API=true`

### Environment Not Switching
1. **Restart React Server**: Changes require restart
2. **Check .env.local**: Verify file exists in `frontend/` directory
3. **Clear Cache**: Delete `node_modules/.cache` if needed

### CORS Issues
- **Local**: Flask has CORS enabled for all origins
- **Vercel**: Same-origin requests (no CORS needed)

## 💡 Best Practices

1. **Use npm scripts** for environment switching
2. **Enable debug mode** during development
3. **Test both environments** before deployment
4. **Check environment indicator** in UI
5. **Commit .env.example** but not .env.local

## 🎯 Benefits

- ✅ **Seamless Development**: Full Flask backend with persistent memory
- ✅ **Easy Testing**: Switch to Vercel mode to test serverless behavior  
- ✅ **Automatic Detection**: No code changes needed between environments
- ✅ **Visual Feedback**: Always know which environment you're using
- ✅ **Debug Support**: Detailed logging when needed
- ✅ **Production Ready**: Automatic Vercel configuration