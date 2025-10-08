import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import StockTickers from './StockTickers';
import ChatBot from './ChatBot';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('tasks'); // 'tasks' or 'stocks'
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Chatbot state - persistent across page changes
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [chatbotStockData, setChatbotStockData] = useState(null);
  
  // Persistent chatbot conversation state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatSessionId, setChatSessionId] = useState(null);
  const [chatConversationSummary, setChatConversationSummary] = useState('');
  const [chatConversationStarted, setChatConversationStarted] = useState(false);
  
  // Persistent chatbot UI state (position and size)
  const [chatPosition, setChatPosition] = useState(() => {
    const defaultX = Math.max(20, window.innerWidth - 420);
    const defaultY = 20;
    return { x: defaultX, y: defaultY };
  });
  const [chatSize, setChatSize] = useState({ width: 400, height: 500 });

  // Fetch tasks from backend
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/tasks');
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks. Make sure the backend is running.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const response = await axios.post('/api/tasks', {
        title: newTask
      });
      setTasks([...tasks, response.data]);
      setNewTask('');
    } catch (err) {
      setError('Failed to add task');
      console.error('Error adding task:', err);
    }
  };

  const toggleTask = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const response = await axios.put(`/api/tasks/${taskId}`, {
        ...task,
        completed: !task.completed
      });
      setTasks(tasks.map(t => t.id === taskId ? response.data : t));
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
    }
  };

  // Chatbot functions
  const openChatWithStock = (stockData) => {
    setChatbotStockData(stockData);
    setChatbotOpen(true);
  };

  const openGeneralChat = () => {
    setChatbotStockData(null);
    setChatbotOpen(true);
  };

  const closeChatbot = () => {
    setChatbotOpen(false);
    // Keep stock data and conversation state for potential reopening
  };

  // Chatbot conversation state handlers with useCallback to prevent re-renders
  const handleChatMessagesUpdate = useCallback((newMessages) => {
    setChatMessages(newMessages);
  }, []);

  const handleChatSessionUpdate = useCallback((sessionId, conversationSummary, conversationStarted) => {
    setChatSessionId(sessionId);
    setChatConversationSummary(conversationSummary);
    setChatConversationStarted(conversationStarted);
  }, []);

  // Chatbot UI state handlers
  const handleChatPositionUpdate = useCallback((newPosition) => {
    setChatPosition(newPosition);
  }, []);

  const handleChatSizeUpdate = useCallback((newSize) => {
    setChatSize(newSize);
  }, []);

  if (loading && currentPage === 'tasks') {
    return <div className="App"><div className="loading">Loading...</div></div>;
  }

  // Render Stock Tickers page
  if (currentPage === 'stocks') {
    return (
      <div className="App">
        <nav className="app-navigation">
          <button 
            onClick={() => setCurrentPage('tasks')} 
            className={currentPage === 'tasks' ? 'nav-button active' : 'nav-button'}
          >
            📋 Task Manager
          </button>
          <button 
            onClick={() => setCurrentPage('stocks')} 
            className={currentPage === 'stocks' ? 'nav-button active' : 'nav-button'}
          >
            📈 Stock Tickers
          </button>
        </nav>
        <StockTickers onOpenChat={openChatWithStock} />
        
        {/* Chatbot - persistent across pages */}
        <ChatBot 
          isOpen={chatbotOpen}
          onClose={closeChatbot}
          stockData={chatbotStockData}
          messages={chatMessages}
          onMessagesUpdate={handleChatMessagesUpdate}
          sessionId={chatSessionId}
          conversationSummary={chatConversationSummary}
          conversationStarted={chatConversationStarted}
          onSessionUpdate={handleChatSessionUpdate}
          position={chatPosition}
          onPositionUpdate={handleChatPositionUpdate}
          size={chatSize}
          onSizeUpdate={handleChatSizeUpdate}
        />
      </div>
    );
  }

  // Render Tasks page
  return (
    <div className="App">
      <nav className="app-navigation">
        <button 
          onClick={() => setCurrentPage('tasks')} 
          className={currentPage === 'tasks' ? 'nav-button active' : 'nav-button'}
        >
          📋 Task Manager
        </button>
        <button 
          onClick={() => setCurrentPage('stocks')} 
          className={currentPage === 'stocks' ? 'nav-button active' : 'nav-button'}
        >
          📈 Stock Tickers
        </button>
      </nav>
      
      <header className="App-header">
        <h1>Full-Stack React + Python App</h1>
        <p>A simple task manager built with React frontend and Flask backend</p>
      </header>

      <main className="App-main">
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={addTask} className="task-form">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter a new task"
            className="task-input"
          />
          <button type="submit" className="add-button">Add Task</button>
        </form>

        <div className="tasks-container">
          <h2>Tasks ({tasks.length})</h2>
          {tasks.length === 0 ? (
            <p className="no-tasks">No tasks yet. Add one above!</p>
          ) : (
            <ul className="task-list">
              {tasks.map(task => (
                <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <span
                    className="task-title"
                    onClick={() => toggleTask(task.id)}
                  >
                    {task.title}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Start Chat Button */}
        <div className="chat-section">
          <button onClick={openGeneralChat} className="start-chat-button">
            💬 Start Chat with AI Assistant
          </button>
          <p className="chat-description">
            Get help with tasks, ask questions, or chat about anything!
          </p>
        </div>
      </main>
      
      {/* Chatbot - persistent across pages */}
      <ChatBot 
        isOpen={chatbotOpen}
        onClose={closeChatbot}
        stockData={chatbotStockData}
        messages={chatMessages}
        onMessagesUpdate={handleChatMessagesUpdate}
        sessionId={chatSessionId}
        conversationSummary={chatConversationSummary}
        conversationStarted={chatConversationStarted}
        onSessionUpdate={handleChatSessionUpdate}
        position={chatPosition}
        onPositionUpdate={handleChatPositionUpdate}
        size={chatSize}
        onSizeUpdate={handleChatSizeUpdate}
      />
    </div>
  );
}

export default App;