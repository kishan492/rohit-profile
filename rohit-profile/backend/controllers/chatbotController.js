const ChatHistory = require('../models/ChatHistory');

// Get chat history for a user
const getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params; // Already validated and sanitized by middleware
    
    const chatHistory = await ChatHistory.findOne({ userId });
    
    if (!chatHistory) {
      return res.json({ messages: [] });
    }

    res.json({ messages: chatHistory.messages });
  } catch (error) {
    console.error('Error fetching chat history:', error.message);
    res.status(500).json({ message: 'Failed to fetch chat history' });
  }
};

// Save chat history for a user
const saveChatHistory = async (req, res) => {
  try {
    const { userId, messages } = req.body; // Already validated and sanitized by middleware

    const chatHistory = await ChatHistory.findOneAndUpdate(
      { userId },
      { 
        userId,
        messages,
        updatedAt: new Date()
      },
      { 
        upsert: true, 
        new: true,
        setDefaultsOnInsert: true
      }
    );

    res.json({ success: true, chatHistory });
  } catch (error) {
    console.error('Error saving chat history:', error.message);
    res.status(500).json({ message: 'Failed to save chat history' });
  }
};

// Clear chat history for a user
const clearChatHistory = async (req, res) => {
  try {
    const { userId } = req.params; // Already validated and sanitized by middleware
    
    await ChatHistory.findOneAndDelete({ userId });
    
    res.json({ success: true, message: 'Chat history cleared' });
  } catch (error) {
    console.error('Error clearing chat history:', error.message);
    res.status(500).json({ message: 'Failed to clear chat history' });
  }
};

module.exports = {
  getChatHistory,
  saveChatHistory,
  clearChatHistory
};