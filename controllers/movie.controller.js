const express = require('express');
const MovieDomain = require('../domain/movie.domain');
const router = express.Router();

class MovieController {

    // get all Movie
    static async getAllMovie(req,res){
        const movieDomain = new MovieDomain();
        movieDomain.getAllMovie(req,res);
    }

    // get specific Movie by id
    static async getMovie(req, res){
        const movieDomain = new MovieDomain();
        movieDomain.getAnMovie(req, res);
    }

    // create Movie 
    static async createMovie(req, res){
        const movieDomain = new MovieDomain();
        movieDomain.createAnMovie(req, res);
    }

    // update Movie
    static async updateMovie(req, res){
        const movieDomain = new MovieDomain();
        movieDomain.editAnMovie(req, res);
    }

    // delete Movie
    static async deleteMovie(req, res){
        const movieDomain = new MovieDomain();
        movieDomain.deleteAnMovie(req, res);
    }
}

// // verify uthantication
// router.use(verifytoken);

// get all Movie
router.get('/', MovieController.getAllMovie);

// get specific Movie by id
router.get('/:id', MovieController.getMovie);

// create Movie 
router.post('/', MovieController.createMovie);

// update Movie
router.put('/:id', MovieController.updateMovie);

// delete Movie
router.delete('/:id', MovieController.deleteMovie);


module.exports = router;



