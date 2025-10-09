import React from 'react';
import { motion } from 'framer-motion';
import { useChatbot } from '@/contexts/ChatbotContext';
import { MessageCircle, X } from 'lucide-react';

const ChatbotButton: React.FC = () => {
  const { isOpen, toggleChatbot } = useChatbot();

  return (
    <div className="fixed bottom-4 right-4 z-50 group">
      <motion.button
        onClick={toggleChatbot}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-lg hover:shadow-xl transition-all duration-300"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <X className="w-5 h-5 transition-transform duration-200" />
        ) : (
          <MessageCircle className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
        )}
      </motion.button>
      
      {/* Hover Tooltip */}
      {!isOpen && (
        <div className="absolute bottom-14 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-white text-gray-800 px-3 py-2 rounded-lg shadow-lg whitespace-nowrap text-sm font-medium">
            How may I help you today?
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotButton;