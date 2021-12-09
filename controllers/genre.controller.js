const express = require("express");
const GenreDomain = require("../domain/genre.domain");
const router = express.Router();

class GenreController {
  // get all Category
  static async getAllCategory(req, res) {
    const GenreDomain = new GenreDomain();
    GenreDomain.getAllCategory(req, res);
  }

  // get specific Category by id
  static async getCategory(req, res) {
    const GenreDomain = new GenreDomain();
    GenreDomain.getAnCategory(req, res);
  }

  // create Category
  static async createCategory(req, res) {
    const GenreDomain = new GenreDomain();
    GenreDomain.createAnCategory(req, res);
  }

  // update Category
  static async updateCategory(req, res) {
    const GenreDomain = new GenreDomain();
    GenreDomain.editAnCategory(req, res);
  }

  // delete Category
  static async deleteCategory(req, res) {
    const GenreDomain = new GenreDomain();
    GenreDomain.deleteAnCategory(req, res);
  }
}

// // verify uthantication
// router.use(verifytoken);

// get all Category
router.get("/", GenreController.getAllCategory);

// get specific Category by id
router.get("/:id", GenreController.getCategory);

// create Category
router.post("/", GenreController.createCategory);

// update Category
router.put("/:id", GenreController.updateCategory);

// delete Category
router.delete("/:id", GenreController.deleteCategory);

module.exports = router;
