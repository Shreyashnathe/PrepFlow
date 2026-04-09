import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hi! I'm your PrepFlow AI Assistant. Need hints on a coding problem, architectural system design, or interview behavioral tactics?" }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/api/chat/ask', {
        prompt: userMessage
      });
      setMessages(prev => [...prev, { sender: 'ai', text: response.data.response }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I couldn't reach the AI server right now. Make sure the Spring Boot backend is fully fully loaded!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-wrapper">
      <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <div className="ai-icon-bg">
            <Bot size={22} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'white', fontWeight: 600 }}>PrepFlow AI</h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Powered by GPT-4o Mini</span>
          </div>
          <button style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer' }} onClick={() => setIsOpen(false)}>
            <X size={22} />
          </button>
        </div>

        <div className="chatbot-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-bubble ${msg.sender} animate-fade-in`}>
              {msg.sender === 'ai' ? (
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              ) : (
                msg.text
              )}
            </div>
          ))}
          {loading && (
            <div className="chat-bubble ai animate-fade-in" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <span className="text-subtle" style={{ fontSize: '0.85rem' }}>Analyzing logic...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-input-area">
          <input 
            type="text" 
            className="chat-input"
            placeholder="Ask for technical help..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            disabled={loading}
          />
          <button className="chat-send-btn" onClick={handleSend} disabled={loading || !input.trim()}>
            <Send size={18} />
          </button>
        </div>
      </div>

      <button className="chatbot-toggle-btn animate-fade-in" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>
    </div>
  );
};

export default Chatbot;
