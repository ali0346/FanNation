// backend/models/role.model.js
const { DataTypes } = require('sequelize');
const sequelize        = require('../config/db');

const Role = sequelize.define('Role', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'roles',
  underscored: true,
  timestamps: false
});

module.exports = Role;
