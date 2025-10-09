const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { getChatHistory, saveChatHistory, clearChatHistory } = require('../controllers/chatbotController');
const { getContactInfo, getPortfolioInfo } = require('../controllers/chatbotInfoController');
const { validateUserId, validateChatData } = require('../middleware/chatbotValidation');

// Rate limiting for chatbot endpoints
const chatbotLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs for chatbot
  message: 'Too many chatbot requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all chatbot routes
router.use(chatbotLimiter);

// Get chat history for a user
router.get('/history/:userId', validateUserId, getChatHistory);

// Save chat history for a user
router.post('/history', validateChatData, saveChatHistory);

// Clear chat history for a user
router.delete('/history/:userId', validateUserId, clearChatHistory);

// Get contact information
router.get('/contact-info', getContactInfo);

// Get portfolio information
router.get('/portfolio-info', getPortfolioInfo);

module.exports = router;