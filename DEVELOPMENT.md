# Development Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm run install-all
   ```

2. **Start Development Servers**
   ```bash
   npm run dev
   ```

3. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Project Structure

```
├── frontend/          # React application
├── backend/           # Flask API server
├── .github/          # GitHub configuration
└── docs/             # Additional documentation
```

## Key Features

- ✅ **Conversation Memory**: Session-based chat with personal info tracking
- ✅ **Drag & Drop Interface**: Resizable, moveable chatbot
- ✅ **Cross-Page Persistence**: Chat state maintained across navigation
- ✅ **Stock Context Integration**: Context-aware conversations
- ✅ **RESTful API**: Clean separation of concerns

## API Endpoints

### Chatbot
- `POST /api/chatbot/message` - Send message with memory
- `GET /api/chatbot/suggestions` - Get contextual suggestions

### Tasks
- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Development Notes

- **Conversation State**: Managed in App.js parent component
- **Memory System**: In-memory storage (see README for database upgrade)
- **Error Handling**: Comprehensive error boundaries and fallbacks
- **Mobile Responsive**: Works on desktop, tablet, and mobile devices

## Testing the Conversation Memory

1. Start a chat: "Hello, my name is John"
2. Get personalized response
3. Switch between pages (Task Manager ↔ Stock Tickers)
4. Verify conversation persists with name recognition

## Production Considerations

See README.md for:
- Database upgrade paths (SQLite, PostgreSQL, MongoDB, MS SQL Server)
- Authentication integration
- Deployment strategies
- Scaling recommendations