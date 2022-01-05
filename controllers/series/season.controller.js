const express = require("express");
const SeasonDomain = require("../../domain/Series/season.domain");
const router = express.Router();
const checkRole = require('../../middleware/middleware');
const verifyToken = require('../../authentication/auth.middleware');

class SeasonController {
  // get all Season
  static getAllSeason(req, res) {
    const seasonDomain = new SeasonDomain();
    seasonDomain.getAllseason(req, res);
  }

  // get specific Season by id
  static getAnSeason(req, res) {
    const seasonDomain = new SeasonDomain();
    seasonDomain.getAnseason(req, res);
  }

  // create Season
  static createSeason(req, res) {
    const seasonDomain = new SeasonDomain();
    seasonDomain.createAnseason(req, res);
  }

  // update Season
  static updateSeason(req, res) {
    const seasonDomain = new SeasonDomain();
    seasonDomain.editAnseason(req, res);
  }

  // delete Season
  static deleteSeason(req, res) {
    const seasonDomain = new SeasonDomain();
    seasonDomain.deleteAnseason(req, res);
  }

  // get all episodes of season
  static getAllEpisodesOfSeason(req, res) {
    const seasonDomain = new SeasonDomain();
    seasonDomain.getAllEpisodesOfSeason(req, res);
  }

  // get specific episode from season
  static getAnEpisodeOfSeason(req, res) {
    const seasonDomain = new SeasonDomain();
    seasonDomain.getAnEpisodeOfSeason(req, res);
  }
  // find and filter Season data
  static async findSeasionAndSort(req, res) {
    const seasonDomain = new SeasonDomain();
    seasonDomain.findSeasionAndSort(req, res);
  }

  // search Season
  static async findseasionBySearch(req, res) {
    const seasonDomain = new SeasonDomain();
    seasonDomain.findseasionBySearch(req, res);
  }
}



// find and filter season data
router.get("/sort/season", SeasonController.findSeasionAndSort);

// search season
router.get("/search/season", SeasonController.findseasionBySearch);

// get all Season
router.get("/:series_id/season/", SeasonController.getAllSeason);

// get specific Season by id
router.get("/:series_id/season/:season_id", SeasonController.getAnSeason);

//authenticate user
router.use(verifyToken);

//verify role
router.use(checkRole);

// create Season
router.post("/:series_id/season/", SeasonController.createSeason);

// update Season
router.put("/:series_id/season", SeasonController.updateSeason);

//soft delete Season
router.put("/:series_id/season/:season_id", SeasonController.deleteSeason);

//get episodes
router.get("/season/Episodes", SeasonController.getAllEpisodesOfSeason);

// get specific episode from season
router.get("/season/Episode", SeasonController.getAnEpisodeOfSeason);


module.exports = router;
