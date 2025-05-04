// backend/routes/pollRoutes.js
const router = require('express').Router();
const auth           = require('../middleware/authMiddleware');
const moderatorOnly  = require('../middleware/moderatorMiddleware');
const { getAllPolls, votePoll, createPoll } = require('../controllers/pollController');

router.get('/', getAllPolls);
router.post('/vote', auth, votePoll);

// NEW — moderators/admins only
router.post('/', auth, moderatorOnly, createPoll);

module.exports = router;
