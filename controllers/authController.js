const httpStatus = require('http-status');
const { validationResult } = require("express-validator");
const tokenService = require('../services/tokenService');
const userService = require('../services/authService');
const message = require('../config/messages');
const catchError = require('../utils/catchError');

module.exports = {
    registration: catchError(async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: message.validate, errors });
        }

        const { name, id } = await userService.createUser(req.body);
        const token = tokenService.createToken({ id });

        res.status(httpStatus.CREATED).json({
            message: `${name} ${message.registered}`,
            status: 1,
            id: id,
            token: token
        });
    }),

    login: catchError(async (req, res) => {
        const { email, password } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: message.validate, errors });
        }

        const { id } = await userService.login(email, password);

        res.status(httpStatus.OK).json({
            message: `${email} ${message.login}`,
            token: tokenService.createToken({ id }),
            status: 1
        });
    }),
}
