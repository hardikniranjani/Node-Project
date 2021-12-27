const express = require("express");
const MovieDomain = require("../domain/movie.domain");
const router = express.Router();

class MovieController {
  // get all Movie
  static async getAllMovie(req, res) {
    console.log("getAllMovie")
    const movieDomain = new MovieDomain();
    movieDomain.getAllMovie(req, res);
  }

  // get specific Movie by id
  static async getMovie(req, res) {
    const movieDomain = new MovieDomain();
    movieDomain.getAnMovie(req, res);
  }

  // create Movie
  static async createMovie(req, res) {
    const movieDomain = new MovieDomain();
    movieDomain.createAnMovie(req, res);
  }

  // update Movie
  static async updateMovie(req, res) {
    const movieDomain = new MovieDomain();
    movieDomain.editAnMovie(req, res);
  }

  //soft delete Movie
  static async deleteMovie(req, res) {
    const movieDomain = new MovieDomain();
    movieDomain.deleteAnMovie(req, res);
  }

  //hard delete Movie
  static async HardDeleteMovie(req, res) {
    const movieDomain = new MovieDomain();
    movieDomain.hardDeleteMovie(req, res);
  }

  static async sortMovie(req,res){
    const movieDomain = new MovieDomain();
    movieDomain.sortMovie(req,res);
  }

   // find and filter movie data by Revenue,Vote_average,Vote_count,Budget,popularity
   static async findMovieBySort(req, res) {
     console.log("findMovieBySort")
    const movieDomain = new MovieDomain();
    movieDomain.findMovieBySort(req, res);
  }

      // search movie by Original_language
  static async findMovieBySearch(req, res) {
    console.log("findMovieBySearch")
   const movieDomain = new MovieDomain();
   movieDomain.findMovieBySearch(req, res);
 }

    static async uploadMovie (req,res){
      const movieDomain = new MovieDomain();
      movieDomain.uploadMovie(req,res);
    }
}


router.get("/", MovieController.sortMovie);

// get all Movie
router.get("/", MovieController.getAllMovie);

// get specific Movie by id
router.get("/:id", MovieController.getMovie);

// create Movie
router.post("/", MovieController.createMovie);

// upload movie
router.post("/upload", MovieController.uploadMovie);

// update Movie
router.put("/:id", MovieController.updateMovie);

//soft delete Movie
router.put("/:id", MovieController.deleteMovie);

//hard delete Movie
router.delete("/:id", MovieController.HardDeleteMovie);


// find and filter movie data
router.get("/sorting/movie", MovieController.findMovieBySort);

   // search movie by Original_language 
router.get("/search/movie", MovieController.findMovieBySearch);
module.exports = router;
