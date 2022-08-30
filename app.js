const express = require('express');
const app = express();
const cors = require("cors");
const sequelize = require('./config/database');
const router = require('./routes/router');
const httpStatus = require('http-status');
const bodyParser = require('body-parser');
const ApiError = require('./utils/apiError');
const { errorHandler } = require('./middlewares/errors');
const morgan = require('morgan');
const winston = require('./config/winston');

sequelize.sync().then(() => console.log('db connected'));

const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined', { stream: winston.stream }));
app.use("/", router);
app.use(errorHandler);

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

app.listen(PORT, async (error) => {
  error ? console.log(error) : console.log(`Server is running on http://localhost:${PORT}`);
});
