// config/database.js

const { Sequelize } = require('sequelize');
const path = require('path'); 

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: '../database.sqlite', // Path to SQLite file
});

module.exports = sequelize;
