const express = require('express');
const UserDomain = require('../domain/user.domain');
const router = express.Router();
const verifyToken = require('../authentication/auth.middleware');


class UserController {
  // get user by id
  static async getAnUser(req, res) {
    const userDomain = new UserDomain();
    userDomain.getAnUser(req, res);
  }

  // create User
  static async createAnUser(req, res) {
    const userDomain = new UserDomain();
    userDomain.createAnUser(req, res);
  }

  // update user
  static async updateAnUser(req, res) {
    const userDomain = new UserDomain();
    userDomain.updateAnUser(req, res);
  }

  // delete user
  static async deleteUser(req, res) {
    const userDomain = new UserDomain();
    userDomain.deleteAnUser(req, res);
  }

  static async getWatchHistory(req, res) {
    const userDomain = new UserDomain();
    userDomain.showWatchHistory(req, res);
  }

  static async addToWatchHistory_Movie(req, res) {
    const userDomain = new UserDomain();
    userDomain.addToWatchHistoryMovie(req, res);
  }

  static async addToWatchHistory_Episode(req, res) {
    const userDomain = new UserDomain();
    userDomain.addToWatchHistoryEpisode(req, res);
  }

  static async deleteHistory(req,res){
    const userDomain = new UserDomain();
    userDomain.deleteWatchHistory(req, res);
  }
}

// create User
router.post('/signup', UserController.createAnUser);

router.post('/login', UserController.getAnUser)

// // verify uthantication
// router.use(verifytoken);

router.use(verifyToken);
// get user by id 
// router.get('/:id', UserController.getUser);


// update user
router.put("/update", UserController.updateAnUser);

// delete user
router.delete('/delete', UserController.deleteUser);

//get user watch history
router.get('/watchHistory',UserController.getWatchHistory);

//add to user watch history movie
router.post('/watchedMovie',UserController.addToWatchHistory_Movie);

//add to user watch history episode
router.post('/watchedEpisode',UserController.addToWatchHistory_Episode);

//delete user watch history 
router.delete('/deleteHistory',UserController.deleteHistory);


module.exports = router;