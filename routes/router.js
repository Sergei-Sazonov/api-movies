const express = require('express');
const multer = require('multer');
const router = express.Router();
const movieController = require('../controllers/movieController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/auth');
const validator = require('../middlewares/validator');
const upload = multer();

router.post('/api/v1/users',
    validator.registration,
    authController.registration
);
router.post('/api/v1/sessions',
    validator.login,
    authController.login
);
router.post('/api/v1/movies',
    validator.createMovie,
    authMiddleware,
    movieController.createMovie
);
router.get('/api/v1/movies',
    authMiddleware,
    movieController.getMovies
);
router.patch('/api/v1/movies/:id',
    authMiddleware,
    movieController.updateMovie
);
router.delete('/api/v1/movies/:id',
    authMiddleware,
    movieController.deleteMovie
);
router.get('/api/v1/movies/:id',
    authMiddleware,
    movieController.getMovieById
);
router.post('/api/v1/movies/import',
    authMiddleware,
    upload.single("movies"),
    movieController.importFile
);

module.exports = router;
