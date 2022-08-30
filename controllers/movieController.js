const httpStatus = require('http-status');
const { validationResult } = require("express-validator");
const movieService = require('../services/movieService');
const message = require('../config/messages');
const catchError = require('../utils/catchError');

module.exports = {
    getMovies: catchError(async (req, res) => {
        const movies = await movieService.getMovies(req.query);

        res.send(movies);
    }),

    createMovie: catchError(async (req, res) => {
        const errors = validationResult(req);
        const movie = await movieService.createMovie(req.body);

        if (!errors.isEmpty()) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: message.validate, errors });
        }

        res.status(httpStatus.CREATED).json({ message: message.movieRegistered, status: 1, data: movie });
    }),

    deleteMovie: catchError(async (req, res) => {
        const { id } = req.params;

        await movieService.deleteMovie(id);
        res.status(httpStatus.OK).json({ message: message.movieDeleted, status: 1});
    }),

    getMovieById: catchError(async (req, res) => {
        const { id } = req.params;
        const movie = await movieService.getMovieById(id);

        res.send(movie);
    }),

    updateMovie: catchError(async (req, res) => {
        const { id } = req.params;
        const movie = await movieService.updateMovie(id, req.body);

        res.status(httpStatus.OK).json({ message: message.movieUpdated, status: 1, data: movie });
    }),

    importFile: catchError(async (req, res) => {
        const result = await movieService.importFile(req.file);

        return res.status(httpStatus.CREATED).json({ message: message.movieRegistered, data: result });
    }),
}
