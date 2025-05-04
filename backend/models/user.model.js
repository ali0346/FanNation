const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bio: DataTypes.TEXT,
  profile_picture: DataTypes.STRING,
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'users',  // Explicitly set the table name to 'users'
  timestamps: true,    // Keep Sequelize's default timestamp columns
  underscored: true    // Ensures Sequelize uses snake_case (created_at, updated_at)
});


module.exports = User;
