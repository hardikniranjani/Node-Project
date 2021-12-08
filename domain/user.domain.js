const UserModel = require("../models/Users/user.model");
const watchHistory = require("../models/Users/watchHistory.model");
const watchLater = require("../models/Users/watchLater.model");
const wishlist = require("../models/Users/wishlist.model");

class UserDomain {

    // create Admin 
    async createAnAdmin(req, res) {
        const Admin = req.body;
        const { error } = UserModel.userValidation(Admin);

        if(error) return res.send("error");

    }


  // create new user domain
  async createAnUser(req, res) {
    const user = req.body;
    const { error } = UserModel.userValidation(user);
  }

  // get all users
  async getAllUsers(req, res) {
    const result = await UserModel.find();

    if (result.Role === "admin") {
      if (result && result.IsActive === true) {
        res.send(result);
      } else {
        res.status(404).send("Can't find User");
      }
    } else {
      res.send("Access denied");
    }
  }

  // get all deleted users

  async getAllDeletedUsers(req, res) {
    const result = await UserModel.find();
    if (result.Role === "admin") {
      if (result && result.IsActive === false) {
        res.send(result);
      } else {
        res.status(404).send("Can't find User");
      }
    } else {
      res.send("Access denied");
    }
  }

  // ger user by Id
  async getAnUser(req, res) {
    var id = req.params.id;

    const result = await UserModel.findById(id);
    if (result) {
      res.send(result);
    } else {
      res.status(404).send("Can't find User");
    }
  }

  // delete user by id
  async deleteAnUser(req, res) {
    var id = req.params.id;

    const result = await UserModel.findById(id);
    if (result.Role === "admin") {
      if (result) {
        await UserModel.findByIdAndUpdate(id, {
          $set: {
            IsActive: false,
          },
        });
        res.send("Successfully deleted");
      } else {
        res.status(404).send("Can't find User");
      }
    } else {
      res.send("Access denied");
    }
  }

    // Hard Delete user by id
    async HardDeleteUser(req, res) {
      var id = req.params.id;
  
      const result = await Users.findByIdAndDelete(id);
      if (result) {
        res.send("Successfully deleted");
      } else {
        res.status(404).send("Can't find User");
      }
    }
    
//   show watch History of user
async showWatchHistory(req, res){
    var User_id = req.params.id;

    const user = await UserModel.findById(User_id);
    
}

}

module.exports = User;
