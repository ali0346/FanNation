// backend/models/pollOption.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PollOption = sequelize.define(
  'PollOption',
  {
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    tableName: 'poll_options',
    underscored: true,
    timestamps: false,   // your schema only has id & poll_id/text
  }
);

module.exports = PollOption;
