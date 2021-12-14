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

module.exports = router;