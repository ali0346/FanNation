const { User } = require('../models');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id','username','email']
    });
    res.json(users);
  } catch (err) {
    console.error('getAllUsers error', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id,10);
    await User.destroy({ where: { id } });
    res.status(204).end();
  } catch (err) {
    console.error('deleteUser error', err);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};
