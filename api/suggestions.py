from http.server import BaseHTTPRequestHandler
import json
import random

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
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
        
        is_follow_up = data.get('isFollowUp', False)
        context = data.get('context', {})
        
        # Suggestion pools
        initial_suggestions = [
            "Tell me about the stock market",
            "What's your favorite stock?",
            "How do I start investing?",
            "Explain market volatility",
            "What are blue chip stocks?"
        ]
        
        follow_up_suggestions = [
            "Tell me more about that",
            "What else should I know?",
            "Any investment tips?",
            "How does that affect prices?",
            "What about risk management?"
        ]
        
        stock_suggestions = [
            f"What's driving {context.get('stock', 'this stock')}'s performance?",
            f"Should I invest in {context.get('stock', 'this company')}?",
            f"What are {context.get('stock', 'this stock')}'s competitors?",
            "What's the company's outlook?",
            "How volatile is this stock?"
        ]
        
        # Choose appropriate suggestion pool
        if context.get('page') == 'stocks' and context.get('stock'):
            suggestions_pool = stock_suggestions
        elif is_follow_up:
            suggestions_pool = follow_up_suggestions
        else:
            suggestions_pool = initial_suggestions
        
        # Return 3 random suggestions
        selected_suggestions = random.sample(suggestions_pool, min(3, len(suggestions_pool)))
        
        response = {'suggestions': selected_suggestions}
        self.wfile.write(json.dumps(response).encode('utf-8'))
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()