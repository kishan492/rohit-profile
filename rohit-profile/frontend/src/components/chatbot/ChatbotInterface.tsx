import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useChatbot } from '@/contexts/ChatbotContext';
import ChatbotMessage from './ChatbotMessage';
import { Send, RefreshCw, Wifi, WifiOff } from 'lucide-react';

const ChatbotInterface: React.FC = () => {
  const { messages, isOpen, isLoading, addMessage, resetChat } = useChatbot();
  const [input, setInput] = React.useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Create a ref for the input field
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Track the original input to restore it after bot response
  const [originalInput, setOriginalInput] = React.useState('');
  
  // Reset input when loading state changes to false (bot finished responding)
  useEffect(() => {
    if (!isLoading) {
      setInput('');
    }
  }, [isLoading]);
  
  // Focus input when chatbot opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);
  
  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      // Save the current input
      setOriginalInput(input);
      // Send the message
      addMessage(input.trim(), 'user');
      // Keep focus on the input field after sending
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed bottom-20 right-4 z-50 w-80 sm:w-96 h-[500px] bg-background/95 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted flex justify-between items-center rounded-t-2xl">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">Hi I am bot👋</h3>
          {isOnline ? (
            <Wifi className="w-4 h-4 text-green-500" title="Online" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-500" title="Offline" />
          )}
        </div>
        <motion.button 
          onClick={resetChat}
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full hover:bg-background/20 transition-colors"
          aria-label="Reset chat"
        >
          <RefreshCw className="w-4 h-4" />
        </motion.button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 chatbot-scrollbar">
        {messages.map((message) => (
          <ChatbotMessage key={message.id} message={message} />
        ))}
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start mb-4"
          >
            <div className="bg-gradient-to-br from-secondary/80 to-secondary text-secondary-foreground rounded-2xl rounded-tl-md max-w-[80%] px-4 py-3 shadow-sm backdrop-blur-sm">
              <div className="flex space-x-1">
                <motion.div 
                  animate={{ y: [-2, 2, -2] }}
                  transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                  className="w-2 h-2 rounded-full bg-primary" 
                />
                <motion.div 
                  animate={{ y: [-2, 2, -2] }}
                  transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                  className="w-2 h-2 rounded-full bg-primary" 
                />
                <motion.div 
                  animate={{ y: [-2, 2, -2] }}
                  transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                  className="w-2 h-2 rounded-full bg-primary" 
                />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border/30 bg-gradient-to-r from-muted/20 to-muted/10 rounded-b-3xl backdrop-blur-sm">
        <div className="flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isOnline ? "Type your message..." : "Offline - Check your connection"}
            className="flex-1 bg-background/80 backdrop-blur-sm border border-input/50 rounded-full rounded-r-none px-4 py-2 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 disabled:opacity-50 transition-all duration-200"
            disabled={isLoading || !isOnline}
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-primary to-accent text-white px-4 h-10 rounded-full rounded-l-none border-0 disabled:opacity-50 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
            disabled={!input.trim() || isLoading || !isOnline}
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default ChatbotInterface;