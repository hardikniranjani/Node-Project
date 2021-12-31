const express = require("express");
const UserDomain = require("../domain/user.domain");
const router = express.Router();
const verifyToken = require("../authentication/auth.middleware");

class UserController {

  //create a new admin
  static async createAnAdmin(req,res){
    const userDomain = new UserDomain();
    userDomain.createAnAdmin(req,res);
  }

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

  //get user watch history
  static async getWatchHistory(req, res) {
    const userDomain = new UserDomain();
    userDomain.showWatchHistory(req, res);
  }

  //add to user watch history movie
  static async addToWatchHistory(req, res) {
    const userDomain = new UserDomain();
    userDomain.addToWatchHistory(req, res);
  }

  //delete user watch history
  static async deleteHistory(req, res) {
    const userDomain = new UserDomain();
    userDomain.deleteWatchHistory(req, res);
  }

  //add to watch later
  static async addToWatchLater(req, res) {
    const userDomain = new UserDomain();
    userDomain.addToWatchLater(req, res);
  }

  //get user watch later list
  static async getWatchLaterList(req, res) {
    const userDomain = new UserDomain();
    userDomain.showWatchLater(req, res);
  }

  // remove watch later list
  static async removeFromWatchLater(req, res) {
    const userDomain = new UserDomain();
    userDomain.removeFromWatchLater(req, res);
  }

  // add wishlist of user
  static async addToWishList(req, res) {
    const userDomain = new UserDomain();
    userDomain.addToWishList(req, res);
  }

  // show wishlist of user
  static async getWishList(req,res){
    const userDomain = new UserDomain();
    userDomain.getWishList(req,res);
  }

  // delete wishlist of user
  static async deleteWishlist(req,res){
    const userDomain = new UserDomain();
    userDomain.removeFromWishlist(req,res);
  }

  // add subscription of user
  static async addSubscription(req,res){
     const userDomain = new UserDomain();
     userDomain.addSubscription(req, res);
  }

  
}


// create User
router.post("/signup", UserController.createAnUser);

// login user
router.post("/login", UserController.getAnUser);

// signup admin
router.post("/create_admin", UserController.createAnAdmin);

// middleware 
router.use(verifyToken);

// update user
router.put("/update", UserController.updateAnUser);

//soft delete user
router.put("/delete", UserController.deleteUser);

//get user watch history
router.get("/watch_history", UserController.getWatchHistory);

//add to user watch history movie
router.post("/watch_history", UserController.addToWatchHistory);

//delete user watch history
router.delete("/delete_history", UserController.deleteHistory);

//add to watch later library
router.post("/watch_later", UserController.addToWatchLater);

//get user watch later list
router.get("/watch_later", UserController.getWatchLaterList);

//remove from watchlater
router.put("/remove", UserController.removeFromWatchLater);

//add to wishlist
router.post("/wishlist", UserController.addToWishList);

//get wishlist 
router.get("/wishlist", UserController.getWishList);

//delete wishlist
router.delete("/wishlist", UserController.deleteWishlist);

// add subscription plan of user
router.post("/addsubscription", UserController.addSubscription);

module.exports = router;
