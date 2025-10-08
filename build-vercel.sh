#!/bin/bash
# Build script for testing Vercel deployment locally

echo "🏗️  Testing Vercel deployment locally..."
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not installed"
    echo "Install with: npm install -g vercel"
    exit 1
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
echo "✅ Frontend dependencies installed"

# Build frontend
echo "🏗️  Building frontend..."
npm run build
echo "✅ Frontend built successfully"

# Return to root
cd ..

echo ""
echo "🚀 Ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Run 'vercel' to deploy"
echo "2. Or push to GitHub and connect to Vercel for auto-deployment"
echo ""
echo "📋 For detailed instructions, see VERCEL_DEPLOYMENT.md"