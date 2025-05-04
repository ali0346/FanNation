const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
    define: {
      // map camelCase model attributes to snake_case columns
      underscored: true,
      // keep your table names exactly as defined (no pluralization)
      freezeTableName: true,
    },
  }
);


module.exports = sequelize;
