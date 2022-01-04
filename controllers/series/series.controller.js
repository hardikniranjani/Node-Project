const express = require("express");
const SeriesDomain = require("../../domain/Series/series.domain");
const router = express.Router();
const verifyToken = require('../../authentication/auth.middleware');
const checkRole = require('../../middleware/middleware');
class seriesController {
  // get all Series
  static getAllSeries(req, res) {
    const seriesDomain = new SeriesDomain();
    seriesDomain.getAllSeries(req, res);
  }

  // get specific  Series by id
  static getSeries(req, res) {
    const seriesDomain = new SeriesDomain();
    seriesDomain.getAnSeries(req, res);
  }

  // create series
  static createSeries(req, res) {
    const seriesDomain = new SeriesDomain();
    seriesDomain.createAnSeries(req, res);
  }

  // update series
  static updateSeries(req, res) {
    const seriesDomain = new SeriesDomain();
    seriesDomain.editAnSeries(req, res);
  }

  //soft delete series
  static deleteSeries(req, res) {
    const seriesDomain = new SeriesDomain();
    seriesDomain.deleteAnSeries(req, res);
  }
  //Hard delete series
  static HardDeleteSeries(req, res) {
    const seriesDomain = new SeriesDomain();
    seriesDomain.HardDeleteSeries(req, res);
  }

  // find and filter series data
  static async findSeriesAndSort(req, res) {
    const seriesDomain = new SeriesDomain();
    seriesDomain.findSeriesAndSort(req, res);
  }

  // search series
  static async findSeriesBySearch(req, res) {
    const seriesDomain = new SeriesDomain();
    seriesDomain.findSeriesBySearch(req, res);
  }
}

//authentication of user
router.use(verifyToken);

// get all Series
router.get("/", seriesController.getAllSeries);

// get specific Series by id
router.get("/:id", seriesController.getSeries);

//check role
router.use(checkRole);
// create series
router.post("/", seriesController.createSeries);

// update series
router.put("/:id", seriesController.updateSeries);

//soft delete series
router.put("/:id", seriesController.deleteSeries);

//Hard delete series
router.delete("/:id", seriesController.HardDeleteSeries);

// find and filter series data
router.get("/sort/series", seriesController.findSeriesAndSort);

// search series
router.get("/search/series", seriesController.findSeriesBySearch);
module.exports = router;
