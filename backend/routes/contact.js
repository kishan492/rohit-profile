const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getContactSection,
  updateContactSection,
  toggleContactVisibility
} = require('../controllers/contactSectionController');

router.get('/', getContactSection);
router.put('/', auth, updateContactSection);
router.patch('/visibility', auth, toggleContactVisibility);

module.exports = router;