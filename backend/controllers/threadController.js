const { User, Category, Thread } = require('../models');


exports.createThread = async (req, res) => {
  try {
    const { title, content, categoryId, userId } = req.body;
    if (!title || !content || !categoryId || !userId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // ensure category & user exist
    const [category, user] = await Promise.all([
      Category.findByPk(categoryId),
      User.findByPk(userId),
    ]);
    if (!category || !user) {
      return res.status(404).json({ message: 'Invalid user or category' });
    }

    const thread = await Thread.create({
      title,
      content,
      user_id: userId,
      category_id: categoryId,
    });

    // include user & category for the response
    const saved = await Thread.findByPk(thread.id, {
      include: [
        { model: User, attributes: ['id','username','profile_picture'] },
        { model: Category, attributes: ['id','name','slug'] }
      ]
    });

    res.status(201).json({
      id: String(saved.id),
      title: saved.title,
      content: saved.content,
      sportId: String(saved.category.id),
      sportName: saved.category.name,
      userId: String(saved.user.id),
      username: saved.user.username,
      userProfilePicture: saved.user.profile_picture,
      dateCreated: saved.created_at,
      likes: 0,
      tags: [],
      replies: [],
      userLiked: false
    });
  } catch (err) {
    console.error('Error creating thread:', err);
    res.status(500).json({ message: 'Failed to create thread' });
  }
};


exports.getThreadsByCategories = async (req, res) => {
  try {
    console.log('>> Incoming categoryIds query:', req.query.categoryIds);

    // Build WHERE clause
    let where = {};
    if (req.query.categoryIds) {
      const ids = req.query.categoryIds
        .split(',')
        .map((id) => parseInt(id, 10))
        .filter(Boolean);
      if (ids.length) where = { category_id: ids };
    }

    // Fetch threads with eager‐loaded User & Category
    const threads = await Thread.findAll({
      where,
      include: [
        { model: User,     attributes: ['id', 'username', 'profile_picture'] },
        { model: Category, attributes: ['id', 'name', 'slug'] }
      ],
      order: [['created_at', 'DESC']],
      limit: 10
    });

    console.log(`>> Retrieved ${threads.length} threads from DB`);

    // Keep only those where both associations are present
    const validThreads = threads.filter(t => t.User && t.Category);
    if (validThreads.length !== threads.length) {
      console.warn(
        `>> Dropping ${threads.length - validThreads.length} threads missing User/Category`
      );
    }

    // Map over the Sequelize instances
    const formatted = validThreads.map(thread => ({
      id:                String(thread.id),
      title:             thread.title,
      content:           thread.content,
      sportId:           String(thread.Category.id),
      sportName:         thread.Category.name,
      userId:            String(thread.User.id),
      username:          thread.User.username,
      userProfilePicture:String(thread.User.profile_picture),
      dateCreated:       thread.created_at,
      likes:             0,
      tags:              [],
      replies:           [],
      userLiked:         false
    }));

    return res.json(formatted);
  } catch (err) {
    console.error('Error in getThreadsByCategories:', err);
    return res.status(500).json({ message: err.message || 'Failed to fetch threads' });
  }
};

//DEL

exports.deleteThread = async (req, res) => {
  try {
    const threadId = parseInt(req.params.id, 10);
    const thread = await Thread.findByPk(threadId);
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }
    await thread.destroy();
    return res.status(204).end();
  } catch (err) {
    console.error('Error deleting thread:', err);
    return res.status(500).json({ message: 'Could not delete thread' });
  }
};

