const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Movie extends Model { }

Movie.init({
    title: {
        type: DataTypes.STRING,
    },
    year: {
        type: DataTypes.NUMBER
    },
    format: {
        type: DataTypes.STRING
    },
    actors: [
        DataTypes.STRING
    ]
}, {
    sequelize,
    modelName: 'Movie'
});

module.exports = Movie;
