const express = require("express");
const SeasonDomain = require("../../domain/Series/season.domain");
const router = express.Router();
const Episode = require("./episode.controller");

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
}

// router.use('/:season_id/episode',Episode);

// get all Season
router.get("/:series_id/season/", SeasonController.getAllSeason);

// get specific Season by id
router.get("/:series_id/season/:season_id", SeasonController.getAnSeason);

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
