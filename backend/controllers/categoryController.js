// backend/controllers/categoryController.js
const { Category, Thread, User } = require('../models');

// GET /api/categories — fetch all with thread + follower counts
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();

    const formatted = await Promise.all(
      categories.map(async (c) => {
        // count threads and followed users
        const threadsCount   = await Thread.count({ where: { category_id: c.id } });
        const followersCount = await c.countUsers();

        return {
          id:          String(c.id),        // <-- force string
          name:        c.name,
          slug:        c.slug,
          color:       c.color,
          icon:        c.icon_name,
          description: c.description,
          threads:     threadsCount,
          followers:   followersCount
        };
      })
    );

    return res.status(200).json(formatted);
  } catch (err) {
    console.error('Error fetching categories:', err);
    return res.status(500).json({ message: 'Failed to fetch categories' });
  }
};

// GET /api/categories/:slug — fetch single by slug
exports.getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const c = await Category.findOne({ where: { slug } });
    if (!c) return res.status(404).json({ message: 'Category not found' });

    const followersCount = await c.countUsers();

    res.json({
      id:          c.id,
      name:        c.name,
      slug:        c.slug,
      icon:        c.icon_name,
      color:       c.color,
      description: c.description,
      threads:     await Thread.count({ where: { category_id: c.id } }),
      followers:   followersCount
    });
  } catch (err) {
    console.error('Error fetching category by slug:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/categories/:id/follow
exports.followCategory = async (req, res) => {
  const userId     = req.user.id;
  const categoryId = parseInt(req.params.id, 10);

  try {
    const c = await Category.findByPk(categoryId);
    if (!c) return res.status(404).json({ message: 'Category not found' });

    await c.addUser(userId);    // Sequelize M2M helper
    res.status(200).json({ message: 'Now following' });
  } catch (err) {
    console.error('followCategory error:', err);
    res.status(500).json({ message: 'Could not follow category' });
  }
};

// DELETE /api/categories/:id/follow
exports.unfollowCategory = async (req, res) => {
  const userId     = req.user.id;
  const categoryId = parseInt(req.params.id, 10);

  try {
    const c = await Category.findByPk(categoryId);
    if (!c) return res.status(404).json({ message: 'Category not found' });

    await c.removeUser(userId);
    res.status(200).json({ message: 'Unfollowed' });
  } catch (err) {
    console.error('unfollowCategory error:', err);
    res.status(500).json({ message: 'Could not unfollow category' });
  }
};

// GET /api/categories/followed/list
exports.getFollowedCategories = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findByPk(userId, {
      include: {
        model: Category,
        attributes: ['id','name','slug','icon_name','color']
      }
    });
    // `user.Categories` is the array of followed categories
    res.json(user.Categories || []);
  } catch (err) {
    console.error('getFollowedCategories error:', err);
    res.status(500).json({ message: 'Failed to load followed categories' });
  }
};

exports.createCategory = async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  try {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const existing = await Category.findOne({ where: { slug } });
    if (existing) {
      return res.status(409).json({ message: 'Category already exists' });
    }

    const newCategory = await Category.create({ name, description, slug });
    res.status(201).json({ message: 'Category created', category: newCategory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while creating category' });
  }
};