const validateUserId = (req, res, next) => {
  const { userId } = req.params;
  
  if (!userId || typeof userId !== 'string' || userId.length > 100) {
    return res.status(400).json({ message: 'Valid User ID is required' });
  }
  
  // Sanitize userId
  req.params.userId = userId.replace(/[^a-zA-Z0-9_-]/g, '');
  next();
};

const validateChatData = (req, res, next) => {
  const { userId, messages } = req.body;
  
  if (!userId || typeof userId !== 'string' || userId.length > 100) {
    return res.status(400).json({ message: 'Valid User ID is required' });
  }
  
  if (!Array.isArray(messages) || messages.length > 100) {
    return res.status(400).json({ message: 'Valid messages array is required (max 100 messages)' });
  }
  
  // Sanitize and validate data
  req.body.userId = userId.replace(/[^a-zA-Z0-9_-]/g, '');
  req.body.messages = messages.slice(0, 100).map(msg => ({
    id: String(msg.id || '').slice(0, 50),
    content: String(msg.content || '').slice(0, 1000),
    type: ['user', 'bot'].includes(msg.type) ? msg.type : 'user',
    timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
  }));
  
  next();
};

module.exports = {
  validateUserId,
  validateChatData
};