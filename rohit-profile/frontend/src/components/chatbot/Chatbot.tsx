import React from 'react';
import { ChatbotProvider } from '@/contexts/ChatbotContext';
import ChatbotButton from './ChatbotButton';
import ChatbotInterface from './ChatbotInterface';

const Chatbot: React.FC = () => {
  return (
    <ChatbotProvider>
      <ChatbotButton />
      <ChatbotInterface />
    </ChatbotProvider>
  );
};

export default Chatbot;