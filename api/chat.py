from http.server import BaseHTTPRequestHandler
import json
import uuid
from datetime import datetime

class ConversationMemory:
    def __init__(self):
        self.conversations = {}
    
    def get_conversation_history(self, session_id):
        return self.conversations.get(session_id, {
            'messages': [],
            'personal_info': {},
            'conversation_summary': '',
            'context': {}
        })
    
    def update_conversation(self, session_id, messages, personal_info=None, context=None):
        if session_id not in self.conversations:
            self.conversations[session_id] = {
                'messages': [],
                'personal_info': {},
                'conversation_summary': '',
                'context': {}
            }
        
        self.conversations[session_id]['messages'] = messages
        if personal_info:
            self.conversations[session_id]['personal_info'].update(personal_info)
        if context:
            self.conversations[session_id]['context'].update(context)

# Global memory instance
memory = ConversationMemory()

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/api/chat':
            # Set CORS headers
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            # Get request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            message = data.get('message', '')
            session_id = data.get('sessionId') or str(uuid.uuid4())
            context = data.get('context', {})
            
            # Get conversation history
            conversation = memory.get_conversation_history(session_id)
            messages = conversation['messages']
            
            # Add user message to history
            messages.append({
                'sender': 'user',
                'message': message,
                'timestamp': datetime.now().isoformat()
            })
            
            # Generate bot response
            bot_message = self._generate_response(message, conversation, context)
            
            # Add bot response to history
            messages.append({
                'sender': 'bot',
                'message': bot_message,
                'timestamp': datetime.now().isoformat()
            })
            
            # Extract personal info
            personal_info = self._extract_personal_info(message)
            
            # Update memory
            memory.update_conversation(session_id, messages, personal_info, context)
            
            # Send response
            response = {
                'response': bot_message,
                'sessionId': session_id,
                'conversationSummary': f"Chat with {len(messages)} messages"
            }
            
            self.wfile.write(json.dumps(response).encode('utf-8'))
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def _generate_response(self, message, conversation, context):
        # Simple response generation logic
        message_lower = message.lower()
        
        if any(word in message_lower for word in ['hello', 'hi', 'hey']):
            return "Hello! How can I help you today?"
        elif 'stock' in message_lower or context.get('page') == 'stocks':
            return f"I see you're interested in stocks! {context.get('stock', 'Let me help')} is a great company to discuss."
        elif any(word in message_lower for word in ['help', 'support']):
            return "I'm here to help! You can ask me about stocks, general information, or just chat."
        else:
            return f"That's interesting! Tell me more about {message[:20]}..."
    
    def _extract_personal_info(self, message):
        # Simple name extraction
        words = message.split()
        personal_info = {}
        
        # Look for "I'm" or "I am" followed by a name
        for i, word in enumerate(words):
            if word.lower() in ['im', "i'm", 'i', 'am'] and i + 1 < len(words):
                next_word = words[i + 1]
                if next_word.isalpha() and next_word[0].isupper():
                    personal_info['name'] = next_word
                    break
        
        return personal_info