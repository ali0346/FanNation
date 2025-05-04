// backend/routes/authRoutes.js
const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/authMiddleware');
const {
  register,
  login,
  // … your other exports …
  updateProfile   // ← import it
} = require('../controllers/authController');
const { deleteUser } = require('../controllers/userController');

// existing:
router.post('/register', register);
router.post('/login',    login);
// → new:
router.patch('/profile', auth, updateProfile);

module.exports = router;
