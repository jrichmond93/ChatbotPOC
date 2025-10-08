# Vercel Deployment Guide

## 🚀 Deploying to Vercel

This application is configured for seamless deployment to Vercel with both frontend and backend API routes.

### Prerequisites
- [Vercel CLI](https://vercel.com/cli) installed globally: `npm i -g vercel`
- Vercel account at [vercel.com](https://vercel.com)

### Deployment Steps

#### Option 1: Deploy via Git (Recommended)
1. **Push to GitHub**: Ensure your code is in a GitHub repository
2. **Connect to Vercel**: 
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
3. **Configure Settings**:
   - **Build Command**: `cd frontend && npm run build`
   - **Output Directory**: `frontend/build`
   - **Install Command**: `cd frontend && npm install`
4. **Deploy**: Click "Deploy" - Vercel will automatically deploy your app!

#### Option 2: Deploy via CLI
```bash
# In your project root
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? (accept default or customize)
# - In which directory is your code located? ./
```

### 🔧 Configuration Files

The project includes these Vercel-specific files:

#### `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build"
    },
    {
      "src": "api/*.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/build/$1"
    }
  ]
}
```

#### API Routes Structure
- `/api/chat.py` - Serverless function for chatbot messages
- `/api/suggestions.py` - Serverless function for suggestion generation
- Frontend automatically builds to static files

### 🌐 API Endpoints

Once deployed, your app will have these endpoints:
- **Frontend**: `https://your-app.vercel.app`
- **Chat API**: `https://your-app.vercel.app/api/chat`
- **Suggestions API**: `https://your-app.vercel.app/api/suggestions`

### 🔒 Environment Variables

For production deployment, set these in Vercel dashboard:
1. Go to your project in Vercel
2. Click "Settings" → "Environment Variables"
3. Add any required variables (none needed for current setup)

### 🛠 Local Development vs Production

#### Local Development (with Flask backend)
```bash
npm run dev  # Runs both React (3000) and Flask (5000)
```

#### Production (Vercel)
- Frontend: Static files served by Vercel CDN
- Backend: Python serverless functions
- No CORS issues (same domain)
- Automatic HTTPS
- Global CDN distribution

### 📊 Monitoring & Analytics

After deployment:
- **Function Logs**: View in Vercel dashboard → Functions tab
- **Analytics**: Available in Vercel dashboard → Analytics tab
- **Performance**: Monitor Core Web Vitals automatically

### 🚨 Limitations & Considerations

#### Memory Limitations
- **Serverless functions reset between calls**
- **No persistent memory** between requests
- Consider upgrading to database for persistent conversations:
  - MongoDB Atlas (free tier)
  - Supabase (free tier)
  - PlanetScale (MySQL, free tier)

#### Function Timeouts
- **Free tier**: 10-second timeout per function
- **Pro tier**: 60-second timeout
- Current chatbot responses are fast (<1 second)

#### Cold Starts
- Functions may have 1-2 second delay on first request
- Subsequent requests are faster (warm functions)

### 🔄 Updates & Redeployment

#### Automatic Deployment
- Push to your main branch → Vercel auto-deploys
- Preview deployments for pull requests
- Rollback capability in dashboard

#### Manual Deployment
```bash
vercel --prod  # Deploy to production
vercel         # Deploy to preview URL
```

### 💡 Pro Tips

1. **Use Preview URLs** for testing before production
2. **Check Function Logs** for debugging API issues  
3. **Monitor Usage** to stay within free tier limits
4. **Enable Analytics** for usage insights
5. **Set up Custom Domain** in Vercel dashboard

### 🆘 Troubleshooting

#### Common Issues:
- **Build Fails**: Check `frontend/package.json` dependencies
- **API Not Working**: Check function logs in Vercel dashboard
- **CORS Errors**: Shouldn't occur (same domain), but check API function headers
- **Memory Reset**: Expected behavior - implement database for persistence

#### Debug Commands:
```bash
vercel logs                    # View deployment logs
vercel dev                     # Test serverless functions locally
cd frontend && npm run build   # Test build locally
```