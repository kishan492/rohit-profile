const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getTeamSection, updateTeamSection, toggleTeamVisibility, resetTeamSection } = require('../controllers/teamSectionController');

router.get('/', getTeamSection);
router.put('/', auth, updateTeamSection);
router.patch('/visibility', auth, toggleTeamVisibility);
router.post('/reset', auth, resetTeamSection);

module.exports = router;