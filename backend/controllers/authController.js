const jwt    = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Role } = require('../models');
require('dotenv').config();

// Optional: configure these emails centrally
const ADMIN_EMAIL     = 'admin@gmail.com';
const MODERATOR_EMAIL = 'mod@gmail.com';  // change as needed

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Decide role based on email
    let roleName = 'user';
    const emailLower = email.toLowerCase();
    if (emailLower === ADMIN_EMAIL) {
      roleName = 'admin';
    } else if (emailLower === MODERATOR_EMAIL) {
      roleName = 'moderator';
    }

    const role = await Role.findOne({ where: { name: roleName } });
    if (!role) throw new Error(`Role "${roleName}" not found in roles table`);

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashed });

    await newUser.addRole(role);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: roleName },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: roleName,
        profilePicture: newUser.profile_picture,
        bio: newUser.bio || '',
        points: newUser.points,
        badges: []
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: err.message || 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, attributes: ['name'] }]
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const userRoles = user.Roles.map(r => r.name);
    const primaryRole = userRoles[0] || 'user';

    const token = jwt.sign(
      { id: user.id, email: user.email, role: primaryRole },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: primaryRole,
        profilePicture: user.profile_picture,
        bio: user.bio,
        points: user.points,
        badges: []
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, bio, profilePicture } = req.body;

    const updates = {};
    if (username !== undefined) updates.username = username;
    if (bio !== undefined) updates.bio = bio;
    if (profilePicture !== undefined) updates.profile_picture = profilePicture;

    await User.update(updates, { where: { id: userId } });

    const updated = await User.findByPk(userId, {
      attributes: ['id','username','email','bio','profile_picture','points']
    });

    res.json({
      user: {
        id: updated.id.toString(),
        username: updated.username,
        email: updated.email,
        profilePicture: updated.profile_picture,
        bio: updated.bio,
        points: updated.points,
      }
    });
  } catch (err) {
    console.error('Error in updateProfile:', err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};
