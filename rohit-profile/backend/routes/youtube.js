const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getYoutubeSection, updateYoutubeSection, toggleYoutubeVisibility, resetYoutubeSection } = require('../controllers/youtubeSectionController');

router.get('/', getYoutubeSection);
router.put('/', auth, updateYoutubeSection);
router.patch('/visibility', auth, toggleYoutubeVisibility);
router.post('/reset', auth, resetYoutubeSection);

module.exports = router;