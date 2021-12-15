const express = require('express');
const SeriesDomain = require('../../domain/Series/series.domain');
const router = express.Router();


class seriesController {

    // get all Series
    static getAllSeries(req,res){
        const seriesDomain = new SeriesDomain();
        seriesDomain.getAllSeries(req,res);
    }

    // get specific  Series by id
    static getSeries(req, res){
        const seriesDomain = new SeriesDomain();
        seriesDomain.getAnSeries(req, res);
    }

    // create series 
    static createSeries(req, res){
        const seriesDomain = new SeriesDomain();
        seriesDomain.createAnSeries(req, res);
    }

    // update series
    static updateSeries(req, res){
         const seriesDomain = new SeriesDomain();
        seriesDomain.editAnSeries(req, res);
    }

    // delete series
    static deleteSeries(req, res){
        const seriesDomain = new SeriesDomain();
        seriesDomain.deleteAnSeries(req, res);
    }
}

// router.use('/:series_id/:session_id/episode',Episode);
// router.use('/:series_id/session',Session);

// // verify uthantication
// router.use(verifytoken);

// get all Series
router.get('/', seriesController.getAllSeries);

// get specific Series by id
router.get('/:id', seriesController.getSeries);

// create series 
router.post('/', seriesController.createSeries);

// update series
router.put('/:id', seriesController.updateSeries);

//soft delete series
router.put('/:id', seriesController.deleteSeries);


module.exports = router;




