// backend/models/pollVote.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PollVote = sequelize.define(
  'PollVote',
  {},
  {
    tableName: 'poll_votes',
    underscored: true,
    timestamps: false,   // your schema has only option_id, user_id, created_at
  }
);

module.exports = PollVote;
