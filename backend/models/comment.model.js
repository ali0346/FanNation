// backend/models/comment.model.js
const { DataTypes } = require('sequelize');
const sequelize      = require('../config/db');

const Comment = sequelize.define('Comment', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  parent_id: {
    type: DataTypes.BIGINT,
    allowNull: true
  }
}, {
  tableName: 'comments',
  underscored: true,
  timestamps: true,    // created_at, updated_at
});

module.exports = Comment;
