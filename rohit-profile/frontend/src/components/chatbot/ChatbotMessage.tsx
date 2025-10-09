import React from 'react';
import { motion } from 'framer-motion';
import { Message } from '@/contexts/ChatbotContext';
import { cn } from '@/lib/utils';

interface ChatbotMessageProps {
  message: Message;
}

const ChatbotMessage: React.FC<ChatbotMessageProps> = ({ message }) => {
  const isBot = message.type === 'bot';
  
  return (
    <div
      className={cn(
        'flex w-full mb-4',
        isBot ? 'justify-start' : 'justify-end'
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3 shadow-sm',
          isBot 
            ? 'bg-gradient-to-br from-secondary/80 to-secondary text-secondary-foreground rounded-tl-md backdrop-blur-sm' 
            : 'bg-gradient-to-br from-primary to-accent text-white rounded-tr-md shadow-lg'
        )}
      >
        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
        <span className="text-xs opacity-70 block text-right mt-1">
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </motion.div>
    </div>
  );
};

export default ChatbotMessage;