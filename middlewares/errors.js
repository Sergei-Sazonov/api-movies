const httpStatus = require('http-status');

const errorHandler = (err, req, res, next) => {
    const { statusCode, message } = err;

    if (!err.isOperational) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
    }

    res.locals.errorMessage = err.message;

    const response = {
        code: statusCode,
        message,
        ...({ stack: err.stack }),
    };

    res.status(statusCode).send(response);
};

module.exports = {
    errorHandler,
};
