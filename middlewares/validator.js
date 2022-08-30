const { check } = require('express-validator');

module.exports = {
    registration: [
        check('email', 'invalid email').isEmail().normalizeEmail(),
        check('email', 'email field can\'t be empty').notEmpty(),        
        check('name', 'name field can\'t be empty').notEmpty(),
        check('password', 'password field can\'t be empty').notEmpty(),
        check('confirmPassword', 'confirmPassword field can\'t be empty').notEmpty(),
    ],

    login: [
        check('email', 'invalid email').isEmail().normalizeEmail(),
        check('email', 'email field can\'t be empty').notEmpty(),
        check('password', 'password field can\'t be empty').notEmpty(),
    ],

    createMovie: [
        check('title', 'title field can\'t be empty').notEmpty(),
        check('year', 'year field can\'t be empty').notEmpty(),
        check('format', 'format field can\'t be empty').notEmpty(),
        check('actors', 'actors field can\'t be empty').notEmpty(),        
    ],
}