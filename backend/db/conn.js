const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE, process.env.USUARIO, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: 'mysql', 
  });

module.exports = sequelize;