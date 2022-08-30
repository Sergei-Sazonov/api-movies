const jwt = require("jsonwebtoken");
const httpStatus = require('http-status');
const ApiError = require("../utils/apiError");
const secret = require("../config/secretkey");

module.exports = function (req, res, next) {
    const unauthorizedError = new ApiError(httpStatus.UNAUTHORIZED, 'UNAUTHORIZED');

    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            throw unauthorizedError;
        }

        const token = authorizationHeader.split(" ")[1];

        if (!token) {
            throw unauthorizedError;
        }

        const userData = jwt.verify(token, secret.key);
        
        if (!userData) {
            throw unauthorizedError;
        }

        next();
    } catch (error) {
        throw unauthorizedError;
    }
};
