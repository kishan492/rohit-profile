const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getFooterSection, updateFooterSection, toggleFooterVisibility } = require('../controllers/footerSectionController');

router.get('/', getFooterSection);
router.put('/', auth, updateFooterSection);
router.patch('/visibility', auth, toggleFooterVisibility);

module.exports = router;