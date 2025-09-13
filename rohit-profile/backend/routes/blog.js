const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getBlogSection, updateBlogSection, toggleBlogVisibility, resetBlogSection } = require('../controllers/blogSectionController');

router.get('/', getBlogSection);
router.put('/', auth, updateBlogSection);
router.patch('/visibility', auth, toggleBlogVisibility);
router.post('/reset', auth, resetBlogSection);

module.exports = router;