// backend/models/poll.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Poll = sequelize.define(
  'Poll',
  {
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expires_at: DataTypes.DATE,    // matches your schema’s expires_at
  },
  {
    tableName: 'polls',
    underscored: true,
    timestamps: true,              // will give you created_at, updated_at
  }
);

module.exports = Poll;
