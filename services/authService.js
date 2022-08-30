const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const ApiError = require('../utils/apiError');
const message = require('../config/messages');

module.exports = {
    async createUser(user) {
        if (user.password !== user.confirmPassword) {
            throw new ApiError(httpStatus.BAD_REQUEST, message.incorrectConfirmPassword);
        }

        if (await this.getUserByEmail(user.email)) {
            throw new ApiError(httpStatus.BAD_REQUEST, message.userAlreadyExist);
        }

        return User.create({
            email: user.email,
            name: user.name,
            password: bcrypt.hashSync(user.password, 7),
            confirmPassword: user.confirmPassword
        });
    },

    async login(email, password) {
        const user = await this.getUserByEmail(email);

        if (!user) {
            throw new ApiError(httpStatus.BAD_REQUEST, message.incorrectEmailOrPassword);
        }

        const resultPass = await bcrypt.compare(password, user.dataValues.password);

        if (!resultPass) {
            throw new ApiError(httpStatus.BAD_REQUEST, message.incorrectEmailOrPassword);
        }

        return user;
    },

    async getUserByEmail(email) {
        return User.findOne({ where: { email: email } });
    },
}
