const express = require('express');
const router  = express.Router();
const auth           = require('../middleware/authMiddleware');
const moderatorOnly  = require('../middleware/moderatorMiddleware');
const {
  getAllUsers,
  deleteUser
} = require('../controllers/userController');

router.get('/',    auth, moderatorOnly, getAllUsers);
router.delete('/:id', auth, moderatorOnly, deleteUser);

module.exports = router;
