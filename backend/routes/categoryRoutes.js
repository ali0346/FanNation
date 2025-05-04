// backend/routes/categoryRoutes.js
const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/authMiddleware');
const adminOnly       = require('../middleware/adminMiddleware');

const {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  followCategory,
  unfollowCategory,
  getFollowedCategories
} = require('../controllers/categoryController');

// 1) Public
router.get('/',           getAllCategories);
router.get('/:slug',      getCategoryBySlug);

// 2) Protected (must come after `/`)
router.get(   '/followed/list', auth, getFollowedCategories);
router.post(  '/:id/follow',    auth, followCategory);
router.delete('/:id/follow',    auth, unfollowCategory);
router.post('/', auth, adminOnly, createCategory);

module.exports = router;
