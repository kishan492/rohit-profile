const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getYoutubeSection, updateYoutubeSection, toggleYoutubeVisibility } = require('../controllers/youtubeSectionController');

router.get('/', getYoutubeSection);
router.put('/', auth, updateYoutubeSection);
router.patch('/visibility', auth, toggleYoutubeVisibility);

module.exports = router;