// backend/controllers/commentController.js
const { Comment, Thread, User } = require('../models');

exports.createReply = async (req, res) => {
  const userId   = req.user.id;
  const threadId = Number(req.params.threadId);
  const { content } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ message: 'Content is required' });
  }

  // verify thread exists
  const thread = await Thread.findByPk(threadId);
  if (!thread) {
    return res.status(404).json({ message: 'Thread not found' });
  }

  try {
    const comment = await Comment.create({
      content,
      user_id: userId,
      thread_id: threadId
    });

    // load with author info
    const saved = await Comment.findByPk(comment.id, {
      include: [{ model: User, attributes: ['id','username','profile_picture'] }]
    });

    res.status(201).json({
      id: String(saved.id),
      threadId: String(threadId),
      userId: String(saved.User.id),
      username: saved.User.username,
      userProfilePicture: saved.User.profile_picture,
      content: saved.content,
      dateCreated: saved.created_at,
      likes: 0,          // you can add comment_likes later
      userLiked: false   // ditto
    });
  } catch (err) {
    console.error('createReply error:', err);
    res.status(500).json({ message: 'Failed to post reply' });
  }
};

exports.getRepliesByThread = async (req, res) => {
    try {
      const threadId = parseInt(req.params.id, 10);
      const comments = await Comment.findAll({
        where: { thread_id: threadId },
        include: [
          { model: User, attributes: ['id','username','profile_picture'] }
        ],
        order: [['created_at','ASC']]
      });
  
      const formatted = comments.map(c => ({
        id:                String(c.id),
        threadId:          String(c.thread_id),
        userId:            String(c.user_id),
        username:          c.User.username,
        userProfilePicture:c.User.profile_picture,
        content:           c.content,
        likes:             0,      // you can hook up thread_likes later
        dateCreated:       c.created_at,
        userLiked:         false   // track per‐user likes later
      }));
  
      res.json(formatted);
    } catch (err) {
      console.error('getRepliesByThread error:', err);
      res.status(500).json({ message: 'Failed to load replies' });
    }
  };