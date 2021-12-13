const express = require("express");
const GenreDomain = require("../domain/genre.domain");
const router = express.Router();

class GenreController {
  // get all Genre
  static async getAllGenre(req, res) {
    const genreDomain = new GenreDomain();
    genreDomain.getAllGenre(req, res);
  }0

  // get specific Genre by id
  static async getGenre(req, res) {
    const genreDomain = new GenreDomain();
    genreDomain.getAnGenre(req, res);
  }

  // create Genre
  static async createGenre(req, res) {
    const genreDomain = new GenreDomain();
    genreDomain.createAnGenre(req, res);
  }

  // update Genre
  static async updateGenre(req, res) {
    const genreDomain = new GenreDomain();
    genreDomain.editAnGenre(req, res);
  }

  // delete Genre
  static async deleteGenre(req, res) {
    const genreDomain = new GenreDomain();
    genreDomain.deleteAnGenre(req, res);
  }
}

// // verify uthantication
// router.use(verifytoken);

// get all Genre
router.get("/", GenreController.getAllGenre);

// get specific Genre by id
router.get("/:id", GenreController.getGenre);

// create Genre
router.post("/", GenreController.createGenre);

// update Genre
router.put("/:id", GenreController.updateGenre);

// delete Genre
router.delete("/:id", GenreController.deleteGenre);

module.exports = router;