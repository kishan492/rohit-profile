const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getFooterSection, updateFooterSection, toggleFooterVisibility, resetFooterSection } = require('../controllers/footerSectionController');

router.get('/', getFooterSection);
router.put('/', auth, updateFooterSection);
router.patch('/visibility', auth, toggleFooterVisibility);
router.post('/reset', auth, resetFooterSection);

module.exports = router;