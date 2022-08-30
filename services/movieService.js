const httpStatus = require('http-status');
const Sequelize = require('sequelize');
const Movie = require('../models/Movie');
const ApiError = require('../utils/apiError');
const message = require('../config/messages');
const op = Sequelize.Op;

module.exports = {
    async getMovies(params) {
        return Movie.findAll({
            where: this.generateWhere(params),
            order: this.generateSortParams(params)
        });
    },

    generateSortParams(params) {
        let value = params.orderBy === "DESC" ? "DESC" : "ASC";
        let key = params.sortBy || "title";

        return [[`${key}`, `${value}`]];
    },

    generateWhere(params) {
        const and = [];

        if (params.searchByName) {
            and.push({ title: params.searchByName });
        }

        if (params.actor) {
            and.push({
                actors: {
                    [op.like]: '%' + params.actor + '%'
                }
            });
        }

        if (params.search) {
            and.push({
                [op.or]: [
                    {
                        actors: {
                            [op.like]: '%' + params.search + '%'
                        }
                    },
                    {
                        title: {
                            [op.like]: '%' + params.search + '%'
                        }
                    }
                ]
            });
        }

        return { [op.and]: and };
    },

    async createMovie(movie) {
        if (await this.getMovieByName(movie.title)) {
            throw new ApiError(httpStatus.BAD_REQUEST, message.movieAlreadyExist);
        }

        return Movie.create(movie);
    },

    async updateMovie(id, body) {
        if (!await this.getMovieById(id)) {
            throw new ApiError(httpStatus.NOT_FOUND, message.movieNotFound);
        }

        const movie = await Movie.findOne({ where: { id: id } });

        return await movie.update(body);
    },

    async deleteMovie(id) {
        if (!await this.getMovieById(id)) {
            throw new ApiError(httpStatus.NOT_FOUND, message.movieNotFound);
        }

        return await Movie.destroy({ where: { id: id } });
    },

    async getMovieByName(name) {
        return Movie.findOne({ where: { title: name } });
    },

    async getMovieById(id) {
        const movie = await Movie.findOne({ where: { id: id } });

        if (!movie) {
            throw new ApiError(httpStatus.NOT_FOUND, message.movieNotFound);
        }

        return movie;
    },

    async importFile(movies) {
        const { mimetype, buffer } = movies;

        if (mimetype !== "text/plain") {
            throw new ApiError(httpStatus.BAD_REQUEST, message.wrongFileFormat);
        }

        const result = buffer
            .toString()
            .split('\n\n')
            .filter(elem => elem !== '')
            .map(sss => sss.split('\n')
                .reduce((acc, item) => {
                    if (item) {
                        const kv = item.split(':');
                        acc[this.dataFieldKeyHandling(kv[0])] = kv[1].trim();
                    }
                    return acc;
                }, {}));

        await Promise.all(result.map(obj => this.createMovie(obj)));
    },

    dataFieldKeyHandling(element) {
        if (element === 'Release Year') {
            return 'year';
        }

        if (element === 'Stars') {
            return 'actors';
        }

        return element.toLowerCase();
    }
}
