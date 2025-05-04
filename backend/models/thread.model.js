const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Thread = sequelize.define('Thread', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'threads',
  timestamps: true,
  underscored: true
});
// routes/categoryRoutes.js
const auth = require('../middleware/authMiddleware');
//router.post('/:id/follow', auth, followCategory);

module.exports = Thread;
