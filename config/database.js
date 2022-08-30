const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  host: './storage/dev.sqlite'
});

module.exports = sequelize;