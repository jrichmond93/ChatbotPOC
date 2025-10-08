#!/bin/bash
# Environment switcher script for development

FRONTEND_DIR="frontend"
ENV_FILE="$FRONTEND_DIR/.env.local"

show_current() {
    if [ -f "$ENV_FILE" ]; then
        echo "Current environment configuration:"
        cat "$ENV_FILE"
    else
        echo "No .env.local file found. Using default Vercel configuration."
    fi
}

switch_to_local() {
    cat > "$ENV_FILE" << EOF
# Environment Configuration for Local Development
REACT_APP_USE_LOCAL_BACKEND=true
REACT_APP_LOCAL_API_BASE_URL=http://localhost:5000
REACT_APP_DEBUG_API=true
EOF
    echo "✅ Switched to LOCAL DEVELOPMENT mode (Flask backend)"
    echo "🔧 Make sure Flask backend is running: cd backend && python app.py"
}

switch_to_vercel() {
    cat > "$ENV_FILE" << EOF
# Environment Configuration for Vercel Production
REACT_APP_USE_LOCAL_BACKEND=false
REACT_APP_DEBUG_API=false
EOF
    echo "✅ Switched to VERCEL PRODUCTION mode (serverless functions)"
    echo "🚀 Ready for deployment or testing with Vercel functions"
}

remove_config() {
    if [ -f "$ENV_FILE" ]; then
        rm "$ENV_FILE"
        echo "✅ Removed local environment configuration"
        echo "🌐 Using default Vercel configuration"
    else
        echo "No .env.local file to remove"
    fi
}

case "$1" in
    "local"|"l")
        switch_to_local
        ;;
    "vercel"|"v"|"production"|"p")
        switch_to_vercel
        ;;
    "remove"|"r"|"default"|"d")
        remove_config
        ;;
    "show"|"s"|"current"|"c"|"")
        show_current
        ;;
    *)
        echo "Environment Switcher for React + Flask/Vercel App"
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  local, l          Switch to local Flask backend"
        echo "  vercel, v         Switch to Vercel serverless functions"
        echo "  remove, r         Remove config (use Vercel default)"
        echo "  show, s           Show current configuration"
        echo ""
        echo "Examples:"
        echo "  $0 local          # Use Flask backend at localhost:5000"
        echo "  $0 vercel         # Use Vercel serverless functions"
        echo "  $0 show           # Display current settings"
        echo ""
        echo "After switching, restart your React dev server for changes to take effect."
        ;;
esac

echo ""
echo "💡 Tip: Restart React dev server after switching: npm start"