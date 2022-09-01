const httpStatus = require('http-status');
const Sequelize = require('sequelize');
const Movie = require('../models/movie');
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
        let value = params.order === "DESC" ? "DESC" : "ASC";
        let key = params.sort || "title";

        return [[`${key}`, `${value}`]];
    },

    generateWhere(params) {
        const and = [];

        if (params.title) {
            and.push({ title: params.title });
        }

        if (params.actor) {
            and.push({
                actors: {
                    [op.like]: "%" + params.actor + "%"
                }
            });
        }

        if (params.search) {
            and.push({
                [op.or]: [
                    {
                        actors: {
                            [op.like]: "%" + params.search + "%"
                        }
                    },
                    {
                        title: {
                            [op.like]: "%" + params.search + "%"
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

        if (movie.title === "") {
            throw new ApiError(httpStatus.BAD_REQUEST, message.emptyValue);
        }

        if (typeof movie.year !== "number" || movie.year < 1900 || movie.year > 2022) {
            throw new ApiError(httpStatus.BAD_REQUEST, message.validateYearField);
        }

        if (this.validateFormat(movie.format)) {
            throw new ApiError(httpStatus.BAD_REQUEST, message.incorrectFormat);
        }

        return Movie.create(movie);
    },

    async updateMovie(id, body) {
        if (!await this.getMovieById(id)) {
            throw new ApiError(httpStatus.NOT_FOUND, message.movieNotFound);
        }

        if (await this.getMovieByName(body.title)) {
            throw new ApiError(httpStatus.BAD_REQUEST, message.movieAlreadyExist);
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
        const { mimetype, buffer, size } = movies;

        if (mimetype !== "text/plain") {
            throw new ApiError(httpStatus.BAD_REQUEST, message.wrongFileFormat);
        }

        if (size < 30) {
            throw new ApiError(httpStatus.BAD_REQUEST, message.emptyFile);
        }

        const result = buffer
            .toString()
            .split('\n\n')
            .filter(elem => elem !== "")
            .map(sss => sss.split('\n')
                .reduce((acc, item) => {
                    if (item) {
                        const kv = item.split(":");
                        acc[this.dataFieldKeyHandling(kv[0])] = kv[1].trim();
                    }
                    return acc;
                }, {}));

        const processedData = this.dataFieldTypeHandling(result);

        return await Promise.all(processedData.map(obj => this.createMovie(obj)));
    },

    dataFieldKeyHandling(element) {
        if (element === "Release Year") {
            return "year";
        }

        if (element === "Stars") {
            return "actors";
        }

        return element.toLowerCase();
    },

    dataFieldTypeHandling(data) {
        return data.map((e) => {
            return {
                title: e.title,
                year: parseInt(e.year, 10),
                format: e.format,
                actors: e.actors
            }
        })
    },

    validateFormat(format) {
        if (format == "VHS" || format == "DVD" || format == "Blu-Ray") {
            return 0
        } else {
            return 1;
        }
    },
}
