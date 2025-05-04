// backend/routes/threadRoutes.js
const express = require('express');
const router = express.Router();

const auth               = require('../middleware/authMiddleware');
const moderatorOnly     = require('../middleware/moderatorMiddleware');
const {
  getThreadsByCategories,
  createThread,
  deleteThread        // ← we’ll add this
} = require('../controllers/threadController');
const { createReply } = require('../controllers/commentController');
const { getRepliesByThread }                 = require('../controllers/commentController');


router.post( '/',     auth, createThread );             // POST /api/threads
router.get(  '/',     getThreadsByCategories );        // GET  /api/threads
router.delete('/:id', auth, moderatorOnly, deleteThread); // DELETE /api/threads/:id
router.post('/:threadId/replies', auth, createReply);
router.post('/:id/replies', getRepliesByThread);
module.exports = router;
