const express = require("express");
const EpisodeDomain = require("../../domain/Series/episode.domain");
const router = express.Router();

class EpisodeController {
  //   // get all episode
  //   static async getAllEpisode(req, res) {
  //     const episodeDomain = new EpisodeDomain();
  //     episodeDomain.getAllEpisodes(req, res);
  //   }

  // get specific  episode by id
  static async getEpisode(req, res) {
    const episodeDomain = new EpisodeDomain();
    episodeDomain.getAnEpisode(req, res);
  }

  // create episode
  static async createEpisode(req, res) {
    const episodeDomain = new EpisodeDomain();
    episodeDomain.createAnEpisode(req, res);
  }

  // create Multiple episode
  static async createMultiEpisode(req, res) {
    const episodeDomain = new EpisodeDomain();
    episodeDomain.createBulkEpisode(req, res);
  }

  // update episode
  static async updateEpisode(req, res) {
    const episodeDomain = new EpisodeDomain();
    episodeDomain.updateAnEpisode(req, res);
  }

  // update bulk episode
  static async updateBulkEpisode(req, res) {
    const episodeDomain = new EpisodeDomain();
    episodeDomain.updateBulkEpisode(req, res);
  }

  // soft bulk delete episode
  static async softDeleteBulkEpisode(req, res) {
    const episodeDomain = new EpisodeDomain();
    episodeDomain.deleteBulkEpisode(req, res);
  }

  // hard delete episode
  static async hardDeleteBulkEpisode(req, res) {
    const episodeDomain = new EpisodeDomain();
    episodeDomain.hardDeleteBulkEpisode(req, res);
  }

    // find and filter series data
    static async findEpisodeAndSort(req, res) {
      const episodeDomain = new EpisodeDomain();
      episodeDomain.findEpisodeAndSort(req, res);
    }
  
    // search series
    static async findEpisodeBySearch(req, res) {
      const episodeDomain = new EpisodeDomain();
      episodeDomain.findEpisodeBySearch(req, res);
    }
}

// // get all episode
// router.get("/:series_id/:season_id/episode", EpisodeController.getAllEpisode);

// create episode
router.post("/", EpisodeController.createEpisode);

// create Multiple episode
router.post("/multiepisode", EpisodeController.createMultiEpisode);
// get specific Series by id
router.get("/episode", EpisodeController.getEpisode);

//soft bulk delete episode
router.put(
  "/episode/bulk_soft_delete",
  EpisodeController.softDeleteBulkEpisode
);

//hard bulk delete episode
router.delete(
  "/episode/bulk_hard_delete",
  EpisodeController.hardDeleteBulkEpisode
);
// update episode
router.put("/episode/update", EpisodeController.updateEpisode);

//bulk update episode
router.put("/episode/bulk_update", EpisodeController.updateBulkEpisode);

// find and filter episode data
router.get("/sort/episode", EpisodeController.findEpisodeAndSort);

// search episode
router.get("/search/episode", EpisodeController.findEpisodeBySearch);
module.exports = router;
