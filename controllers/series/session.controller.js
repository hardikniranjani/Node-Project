const express = require('express');
const SessionDomain = require('../../domain/Series/series.domain');
const router = express.Router();
const Episode = require('./episode.controller');

class sessionController {

    // get all sessions
    static getAllSessions(req,res){
        const sessionDomain = new SessionDomain();
        sessionDomain.getAllSession(req, res);
    }

    // get specific session by id
    static getAnSession(req,res){
        const sessionDomain = new SessionDomain();
        sessionDomain.getAnSession(req, res);
    }

    // create session
    static createSession(req,res){
        const sessionDomain = new SessionDomain();
        sessionDomain.createAnSession(req, res);
    }

    // update session
    static updateSession(req,res){
        const sessionDomain = new SessionDomain();
        sessionDomain.editAnSession(req, res);
    }

    // delete session
    static deleteSession(req,res){
        const sessionDomain = new SessionDomain();
        sessionDomain.deleteAnSession(req, res);
    }
}

// router.use('/:session_id/episode',Episode);

// get all sessions
router.get('/:series_id/session/',sessionController.getAllSessions);

// get specific session by id
router.get('/:series_id/session/:session_id',sessionController.getAnSession);

// create session
router.post('/:series_id/session/',sessionController.createSession);

// update session
router.put('/:series_id/session/:session_id',sessionController.updateSession);

// delete session
router.delete('/:series_id/session/:session_id',sessionController.deleteSession);

module.exports = router;