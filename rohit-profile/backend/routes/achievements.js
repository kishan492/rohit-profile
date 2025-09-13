const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAchievementsSection,
  updateAchievementsSection,
  toggleAchievementsVisibility,
  resetAchievementsSection
} = require('../controllers/achievementsSectionController');

router.get('/', getAchievementsSection);
router.put('/', auth, updateAchievementsSection);
router.patch('/visibility', auth, toggleAchievementsVisibility);
router.post('/reset', auth, resetAchievementsSection);

module.exports = router;