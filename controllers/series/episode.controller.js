const express = require('express');
const EpisodeDomain = require('../../domain/episode.domain');
const router = express.Router();


class EpisodeController {

    // get all episode 
    static async getAllEpisode(req,res){
        const episodeDomain = new EpisodeDomain();
        episodeDomain.getAllEpisodes(req,res);
    }

    // get specific  episode by id
    static async getEpisode(req, res){
        const episodeDomain = new EpisodeDomain();
        episodeDomain.getAnEpisode(req, res);
    }

    // create episode 
    static async createEpisode(req, res){
        const episodeDomain = new EpisodeDomain();
        episodeDomain.createAnEpisode(req, res);
    }

    // create Multiple episode 
    static async createMultiEpisode(req, res){
        const episodeDomain = new EpisodeDomain();
        episodeDomain.createMultiEpisode(req, res);
    }

    // update episode
    static async updateEpisode(req, res){
         const episodeDomain = new EpisodeDomain();
         episodeDomain.editAnEpisode(req, res);
    }

    // delete episode
    static async deleteEpisode(req, res){
        const episodeDomain = new EpisodeDomain();
        episodeDomain.deleteAnEpisode(req, res);
    }
}

// get all episode 
router.get('/:series_id/:session_id/episode',EpisodeController.getAllEpisode);

// get specific Series by id
router.get('/:series_id/:session_id/episode/:episode_id', EpisodeController.getEpisode);

// create episode 
router.post('/:series_id/:session_id/episode',EpisodeController.createEpisode);

// create Multiple episode 
router.post('/:series_id/:session_id/multiepisode',EpisodeController.createMultiEpisode);

// update episode
router.put('/:series_id/:session_id/episode/:episode_id',EpisodeController.updateEpisode);

// delete episode
router.delete('/:series_id/:session_id/episode/:episode_id',EpisodeController.deleteEpisode);


module.exports = router;
