const express = require('express');
const router = express.Router();
const { getSettings, updateSettings, resetSettings } = require('../controllers/settingsController');
const auth = require('../middleware/auth');

// Get settings
router.get('/', getSettings);

// Update settings (protected)
router.put('/', auth, updateSettings);

// Reset settings (protected)
router.post('/reset', auth, resetSettings);

module.exports = router;