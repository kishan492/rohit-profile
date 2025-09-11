const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getTeamSection, updateTeamSection, toggleTeamVisibility } = require('../controllers/teamSectionController');

router.get('/', getTeamSection);
router.put('/', auth, updateTeamSection);
router.patch('/visibility', auth, toggleTeamVisibility);

module.exports = router;