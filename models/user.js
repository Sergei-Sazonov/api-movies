const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class User extends Model { }

User.init({
  email: {
    type: DataTypes.STRING,
  },
  name: {
    type: DataTypes.STRING
  },
  password: {
    type: DataTypes.STRING
  },
}, {
  sequelize,
  modelName: 'User'
});

module.exports = User;