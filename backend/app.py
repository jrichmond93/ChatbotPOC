from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
import uuid

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# In-memory conversation storage (use Redis/database in production)
conversation_sessions = {}

class ConversationMemory:
    def __init__(self, session_id):
        self.session_id = session_id
        self.messages = []
        self.context = {}
        self.user_preferences = {}
        self.created_at = datetime.now()
        self.last_activity = datetime.now()
    
    def add_message(self, message, sender, context=None):
        self.messages.append({
            'id': str(uuid.uuid4()),
            'message': message,
            'sender': sender,
            'timestamp': datetime.now().isoformat(),
            'context': context or {}
        })
        self.last_activity = datetime.now()
        
        # Extract personal information from user messages
        if sender == 'user':
            self._extract_personal_info(message)
    
    def get_recent_messages(self, limit=10):
        return self.messages[-limit:] if self.messages else []
    
    def update_context(self, new_context):
        self.context.update(new_context)
    
    def get_conversation_summary(self):
        """Generate a summary of the conversation for context"""
        if len(self.messages) < 3:
            return "New conversation"
        
        recent_topics = []
        stock_mentions = set()
        
        for msg in self.messages[-5:]:
            if msg.get('context') and msg['context'].get('stock'):
                stock_symbol = msg['context']['stock'].get('symbol')
                if stock_symbol:
                    stock_mentions.add(stock_symbol)
                    recent_topics.append(f"discussed {stock_symbol}")
        
        if stock_mentions:
            return f"Recent topics: {', '.join(recent_topics)}"
        else:
            return "General conversation about tasks and app features"
    
    def get_mentioned_stocks(self):
        """Get all stocks mentioned in the conversation"""
        stocks = set()
        for msg in self.messages:
            if msg.get('context') and msg['context'].get('stock'):
                stock_symbol = msg['context']['stock'].get('symbol')
                if stock_symbol:
                    stocks.add(stock_symbol)
        return list(stocks)
    
    def _extract_personal_info(self, message):
        """Extract and remember personal information from messages"""
        import re
        message_lower = message.lower()
        
        # Extract name patterns
        name_patterns = [
            r'my name is (\w+)',
            r"i'?m (\w+)",
            r'i am (\w+)',
            r'call me (\w+)',
            r"i'm called (\w+)"
        ]
        
        for pattern in name_patterns:
            match = re.search(pattern, message_lower)
            if match:
                name = match.group(1).capitalize()
                self.user_preferences['name'] = name
                self.context['user_name'] = name
                break
    
    def get_user_name(self):
        """Get the user's name if known"""
        return self.user_preferences.get('name') or self.context.get('user_name')

# Sample data
tasks = [
    {"id": 1, "title": "Learn React", "completed": False},
    {"id": 2, "title": "Build Flask API", "completed": True},
    {"id": 3, "title": "Connect Frontend to Backend", "completed": False}
]

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "Flask backend is running!"})

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    """Get all tasks"""
    return jsonify(tasks)

@app.route('/api/tasks', methods=['POST'])
def create_task():
    """Create a new task"""
    data = request.get_json()
    new_task = {
        "id": len(tasks) + 1,
        "title": data.get('title', ''),
        "completed": False
    }
    tasks.append(new_task)
    return jsonify(new_task), 201

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    """Update a task"""
    data = request.get_json()
    task = next((task for task in tasks if task['id'] == task_id), None)
    
    if not task:
        return jsonify({"error": "Task not found"}), 404
    
    task['title'] = data.get('title', task['title'])
    task['completed'] = data.get('completed', task['completed'])
    
    return jsonify(task)

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Delete a task"""
    global tasks
    tasks = [task for task in tasks if task['id'] != task_id]
    return jsonify({"message": "Task deleted successfully"})

@app.route('/api/chatbot/message', methods=['POST'])
def chat_message():
    """Handle chat messages with conversation memory"""
    data = request.get_json()
    session_id = data.get('sessionId') or str(uuid.uuid4())
    message = data.get('message', '')
    stock_context = data.get('stockContext')
    
    # Get or create conversation session
    if session_id not in conversation_sessions:
        conversation_sessions[session_id] = ConversationMemory(session_id)
    
    conversation = conversation_sessions[session_id]
    
    # Add user message to memory
    conversation.add_message(message, 'user', {'stock': stock_context})
    
    # Update context if stock-related
    if stock_context:
        conversation.update_context({
            'current_stock': stock_context.get('symbol'),
            'stock_price': stock_context.get('price'),
            'conversation_type': 'stock_analysis'
        })
    
    # Generate contextual response
    response = generate_contextual_response(message, conversation)
    
    # Add bot response to memory
    conversation.add_message(response, 'bot')
    
    return jsonify({
        'response': response,
        'sessionId': session_id,
        'conversationSummary': conversation.get_conversation_summary(),
        'messageCount': len(conversation.messages),
        'mentionedStocks': conversation.get_mentioned_stocks()
    })

def generate_contextual_response(message, conversation):
    """Generate response based on conversation history and context"""
    recent_messages = conversation.get_recent_messages(5)
    current_stock = conversation.context.get('current_stock')
    mentioned_stocks = conversation.get_mentioned_stocks()
    user_name = conversation.get_user_name()
    
    message_lower = message.lower()
    
    # Handle name-related queries
    if any(word in message_lower for word in ['my name', 'what is my name', "what's my name", 'remember my name']):
        if user_name:
            return f"Yes, I remember! Your name is {user_name}. It's nice to continue our conversation together."
        else:
            return "I don't believe you've told me your name yet. Feel free to let me know what you'd like me to call you!"
    
    # Personalized greetings when name is known
    if user_name and any(word in message_lower for word in ['hello', 'hi ', 'hey']):
        return f"Hello again, {user_name}! How can I help you today? We can continue discussing stocks, tasks, or explore new topics."
    
    # Context-aware responses based on conversation history
    if current_stock and any(word in message_lower for word in ['price', 'current price', "what's the price"]):
        stock_price = conversation.context.get('stock_price', 'N/A')
        return f"The current price of {current_stock} is ${stock_price}. We've been discussing this stock in our conversation. Would you like me to explain any price movements or compare it with other stocks we've talked about?"
    
    if len(mentioned_stocks) > 1 and 'compare' in message_lower:
        return f"In our conversation, we've discussed {', '.join(mentioned_stocks)}. I can help you compare their performance, market cap, P/E ratios, or recent price movements. Which aspect would you like to focus on?"
    
    if any(word in message_lower for word in ['remember', 'mentioned', 'talked about', 'discussed']):
        if mentioned_stocks:
            return f"In our conversation, you've asked about: {', '.join(mentioned_stocks)}. We've covered topics like current prices, market trends, and company information. What specific aspect would you like me to elaborate on?"
        else:
            recent_topics = [msg['message'] for msg in recent_messages[-3:] if msg['sender'] == 'user']
            if recent_topics:
                return f"We've been discussing various topics including: {', '.join(recent_topics[:2])}{'...' if len(recent_topics) > 2 else ''}. What would you like to know more about?"
            else:
                return "We're just getting started with our conversation! Feel free to ask me about tasks, stocks, or any features of this app."
    
    if 'summary' in message_lower or 'recap' in message_lower:
        summary = conversation.get_conversation_summary()
        message_count = len(conversation.messages)
        return f"Here's a recap of our conversation ({message_count} messages): {summary}. We can continue exploring any of these topics or move on to something new. What interests you most?"
    
    # Stock-specific contextual responses
    if current_stock:
        if 'buy' in message_lower or 'sell' in message_lower:
            return f"I can't provide investment advice, but I can share that we've been discussing {current_stock} at ${conversation.context.get('stock_price', 'N/A')}. Consider factors like your risk tolerance, investment timeline, and portfolio diversification. Would you like me to explain what to research before making investment decisions?"
        
        if 'risk' in message_lower:
            return f"When discussing {current_stock}, it's important to consider various risks: market volatility, company-specific risks, and sector-wide challenges. Based on our conversation, would you like me to explain any specific risk factors or how to assess them?"
    
    # Task and app-related contextual responses
    if any(word in message_lower for word in ['task', 'todo', 'manage']):
        return f"I can help you with task management! This app lets you create, complete, and delete tasks. Based on our conversation, you seem interested in both productivity features and market data. Would you like tips on organizing tasks or managing investment research?"
    
    if 'feature' in message_lower or 'app' in message_lower:
        return f"This app has several features we can explore: task management, real-time stock data, and this AI chat system. Given our conversation history, you might be interested in how the stock data updates or how to use tasks to track your investment research. What would you like to learn about?"
    
    # General contextual responses with memory
    if len(recent_messages) > 1:
        last_user_message = next((msg['message'] for msg in reversed(recent_messages) if msg['sender'] == 'user'), '')
        if last_user_message and last_user_message != message:
            return f"Following up on your question about '{message}' - and considering we just discussed '{last_user_message}' - I can provide more specific guidance. These topics are related in how they both connect to {conversation.get_conversation_summary().lower()}. Would you like me to explore the connections?"
    
    # Default response with context
    summary = conversation.get_conversation_summary()
    if mentioned_stocks:
        return f"Based on our conversation about {', '.join(mentioned_stocks[:2])}{'and others' if len(mentioned_stocks) > 2 else ''}, I understand you're asking about '{message}'. How can I help you dive deeper into this topic?"
    else:
        return f"That's an interesting question about '{message}'. {summary}. I'm here to help with tasks, stock information, app features, or general questions. What specific aspect would you like me to focus on?"

@app.route('/api/chatbot/suggestions', methods=['GET'])
def get_chatbot_suggestions():
    """Get contextual chatbot message suggestions based on conversation memory"""
    import random
    
    session_id = request.args.get('sessionId')
    stock_symbol = request.args.get('stock')
    is_followup = request.args.get('followup', 'false').lower() == 'true'
    
    # Get conversation context if session exists
    conversation_context = {}
    if session_id and session_id in conversation_sessions:
        conversation = conversation_sessions[session_id]
        conversation_context = {
            'message_count': len(conversation.messages),
            'mentioned_stocks': conversation.get_mentioned_stocks(),
            'conversation_type': conversation.context.get('conversation_type', 'general'),
            'current_stock': conversation.context.get('current_stock'),
            'summary': conversation.get_conversation_summary()
        }
    
    # Generate context-aware suggestions
    suggestions = generate_smart_suggestions(stock_symbol, is_followup, conversation_context)
    
    return jsonify({
        'suggestions': suggestions,
        'context': 'stock' if stock_symbol else 'general',
        'conversationContext': conversation_context,
        'sessionId': session_id
    })

def generate_smart_suggestions(stock_symbol, is_followup, conversation_context):
    """Generate suggestions based on conversation history and context"""
    import random
    
    mentioned_stocks = conversation_context.get('mentioned_stocks', [])
    message_count = conversation_context.get('message_count', 0)
    current_stock = conversation_context.get('current_stock')
    
    # Initial general suggestions
    initial_general_suggestions = [
        "How can I add a new task?",
        "What features are available on this app?",
        "Can you help me navigate the interface?",
        "Tell me about the stock market data",
        "How do I manage my tasks effectively?",
        "What can you help me with?",
        "Explain how to use the task manager",
        "Show me how to mark tasks as complete",
        "Can you give me productivity tips?",
        "What's the difference between the pages?"
    ]
    
    # Follow-up general suggestions
    followup_general_suggestions = [
        "Can you explain that in more detail?",
        "What else should I know about this?",
        "Are there any tips or best practices?",
        "How does this compare to other options?",
        "Can you give me an example?",
        "What are the benefits of doing this?",
        "Is there anything I should be careful about?",
        "How often should I do this?",
        "What's the most important thing to remember?",
        "Can you help me with something else?",
        "Tell me about another feature",
        "What would you recommend for beginners?",
        "How can I be more efficient?",
        "What are some common mistakes to avoid?",
        "Can you show me a different approach?"
    ]
    
    # Initial stock-specific suggestions
    initial_stock_suggestions = [
        "What's the current price trend?",
        "Should I be concerned about this stock?",
        "Tell me more about this company",
        "What does the trading volume indicate?",
        "How has this stock performed recently?",
        "What factors affect this stock price?",
        "Is this a good investment opportunity?",
        "Compare this to other tech stocks",
        "What's the market sentiment for this stock?",
        "Explain the price changes today"
    ]
    
    # Follow-up stock suggestions
    followup_stock_suggestions = [
        "What about the long-term outlook?",
        "How does this compare to competitors?",
        "What are the main risks with this stock?",
        "Should I consider buying more?",
        "What news might affect this stock?",
        "Is this stock suitable for beginners?",
        "What's the dividend situation?",
        "How volatile is this stock typically?",
        "What do analysts say about this stock?",
        "When is the best time to buy/sell?",
        "What's the company's financial health?",
        "Are there any upcoming events to watch?",
        "How does market sentiment look?",
        "What's the technical analysis showing?",
        "Should I set a stop loss?"
    ]
    
    # Context-aware suggestion generation
    if stock_symbol and not is_followup:
        # Initial stock questions
        suggestions_pool = [
            f"What's {stock_symbol}'s current trend?",
            f"Tell me about {stock_symbol}'s fundamentals",
            f"How is {stock_symbol} performing today?",
            f"What are the risks with {stock_symbol}?",
            f"Compare {stock_symbol} to its competitors"
        ] + initial_stock_suggestions
        
    elif stock_symbol and is_followup:
        # Follow-up stock questions based on conversation
        if len(mentioned_stocks) > 1:
            # Multi-stock conversation
            other_stocks = [s for s in mentioned_stocks if s != stock_symbol][:2]
            suggestions_pool = [
                f"How does {stock_symbol} compare to {', '.join(other_stocks)}?",
                f"Which has better growth potential: {stock_symbol} or {other_stocks[0] if other_stocks else 'other stocks'}?",
                "What's the risk profile of each stock we discussed?",
                f"Should I diversify between {stock_symbol} and the other stocks we talked about?"
            ] + followup_stock_suggestions
        else:
            # Single stock deep dive with memory
            suggestions_pool = [
                f"What's the long-term outlook for {stock_symbol}?",
                f"Should I buy more {stock_symbol} at this price?",
                f"What are analysts saying about {stock_symbol}?",
                f"How has {stock_symbol} performed historically?",
                "Can you summarize what we've discussed about this stock?"
            ] + followup_stock_suggestions
            
    elif not stock_symbol and message_count > 3:
        # General conversation with history
        if mentioned_stocks:
            suggestions_pool = [
                f"Let's discuss a different stock than {mentioned_stocks[-1]}",
                "Can you summarize our stock discussion?",
                "What other investment options should I consider?",
                f"How do the stocks we discussed ({', '.join(mentioned_stocks[:2])}) fit in a portfolio?",
                "What should I research next based on our conversation?"
            ] + followup_general_suggestions
        else:
            suggestions_pool = [
                "Help me find stocks to research",
                "What market trends should I know about?",
                "Can you explain different investment strategies?",
                "Based on our conversation, what should I focus on?",
                "What other app features might interest me?"
            ] + followup_general_suggestions
    else:
        # Default initial suggestions
        suggestions_pool = initial_general_suggestions
    
    # Return 3 random suggestions, ensuring we don't exceed available suggestions
    num_suggestions = min(3, len(suggestions_pool))
    return random.sample(suggestions_pool, num_suggestions) if suggestions_pool else [
        "How can I help you today?",
        "What would you like to know?",
        "Tell me what interests you most"
    ]

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)