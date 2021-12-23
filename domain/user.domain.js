require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserModel, userValidation } = require("../models/Users/user.model");
const watchHistory = require("../models/Users/watchHistory.model");
const watchLater = require("../models/Users/watchLater.model");
const wishlist = require("../models/Users/wishlist.model");

class UserDomain {
  // create Admin
  async createAnAdmin(req, res) {
    const Admin = req.body;
    const { error } = userValidation(Admin);

    if (error) return res.send("error");
  }

  // create new user, signup path
  async createAnUser(req, res) {
    const user = req.body;

    const { error } = userValidation(user);
    if (error) return res.status(500).send(error.details[0].message);

    const findUser = await UserModel.findOne({ Email: user.email });

    if (findUser) return res.status(400).send("User already registered");

    const allUser = await UserModel.find().sort({ _id: -1 });

    let id = 1;

    if (allUser.length == 0) {
      id = 1;
    } else {
      id = allUser[0]._id + 1;
    }

    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(user.password, salt);

    let newUser = new UserModel({
      _id: id,
      Name: user.name,
      Email: user.email,
      Password: newPassword,
    });

    try {
      const result = await newUser.save();

      const token = jwt.sign(
        { _id: newUser._id, role: "user" },
        process.env.ACCESS_TOKEN_SECRET,
        {
          algorithm: "HS256",
          expiresIn: "7200m",
        }
      );
      console.log(token);
      res.header("x-access-token", token).send(result);
    } catch (e) {
      res.send(e.message);
    }
  }

  //get user ,login path
  async getAnUser(req, res) {
    const user = req.body;
    console.log(user, "line 70");
    const findUser = await UserModel.findOne({ Email: user.email });

    if (findUser && findUser.IsActive) {
      if (bcrypt.compareSync(user.password, findUser.Password)) {
        const token = jwt.sign(
          { _id: findUser._id, role: findUser.Role },
          process.env.ACCESS_TOKEN_SECRET,
          {
            algorithm: "HS256",
            expiresIn: "7200m",
          }
        );
        console.log(token);
        res.header("x-access-token", token).send(findUser);
      } else {
        res.status(400).send("Invalid Email Or Password!!!");
      }
    } else {
      res.status(404).send("Can't find User");
    }
  }

  async updateAnUser(req, res) {
    const user = req.body;
    const user_id = req.user._id;

    const { error } = userValidation(user);
    if (error) return res.status(400).send(error.details[0].message);

    const findUser = await UserModel.findById(user_id);

    if (!findUser.IsActive) {
      res.status(501).send("User not found");
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: user_id },
      {
        $set: {
          Name: user.name,
          Email: user.email,
        },
      },
      { new: true }
    );

    try {
      const result = await updatedUser.save();
      res.send(result);
    } catch (err) {
      res.send(err);
    }
  }

  // soft delete of user
  // delete user by id
  async deleteAnUser(req, res) {
    var id = req.user._id;

    const result = await UserModel.findById(id);

    if (!result.IsActive) {
      res.status(501).send("User not found");
      return;
    }

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
  }

  // soft delete of user by admin side
  // delete user by id
  async deleteAnUserByAdmin(req, res) {
    var id = req.params.id;

    if (!(req.user.role == "admin")) res.status(401).send("Access Denied!!!");

    const result = await UserModel.findById(id);

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
  }

  // get all users
  async getAllUsers(req, res) {
    if (req.user.role == "admin") res.status(401).send("Access Denied!!!");

    const result = await UserModel.find({ IsActive: true });

    if (result) res.status(200).send(result);
    else res.status(404).send("Can't find User");
  }

  // get all deleted users

  async getAllDeletedUsers(req, res) {
    if (req.user.role == "admin") res.status(401).send("Access Denied!!!");

    const result = await UserModel.find({ IsActive: false });

    if (result) res.status(200).send(result);
    else res.status(404).send("Can't find User");
  }

  // ger user by Id

  // Hard Delete user by id
  async HardDeleteUser(req, res) {
    var id = req.params.id;

    const result = await UserModel.findByIdAndDelete(id);
    if (result) {
      res.send("Successfully deleted");
    } else {
      res.status(404).send("Can't find User");
    }
  }

  //   show watch History of user
  async showWatchHistory(req, res) {
    var User_id = req.user._id;

    const history = await watchHistory
      .find({ User: User_id })
      .populate("Movies")
      .populate({
        path: "Episode",
        populate: { path: "SeriesID" },
      })
      .populate({
        path: "Episode",
        populate: { path: "SeasonID" },
      });

    if (history.length == 0)
      return res.status(404).send({ msg: "History not available" });

    const movieArray = history[0]["Movies"].map((obj) => {
      if (obj.MovieName) {
        return { movie_name: obj.MovieName, movie_id: obj._id };
      }
    });

    const episodeArray = history[0]["Episode"].map((obj) => {
      if (obj.EpisodeName) {
        return {
          episode_name: obj.EpisodeName,
          episode_id: obj._id,
          seriesid: obj.SeriesID._id,
          seriesName: obj.SeriesID.SeriesName,
          seasonid : obj.SeasonID._id,
          seasonName : obj.SeasonID.SeasonName
        };
      }
    });

    res.status(200).send({
      movies: movieArray.reverse(),
      episodes: episodeArray,
    });
  }

  //add Movie to watch History of user
  async addToWatchHistory(req, res) {
    var User_id = req.user._id;
    var media_id = req.query.media_id;
    var media_type = req.query.media_type;
    console.log([media_type]);
    const history = await watchHistory.find({ User: User_id });

    if (history.length == 0) {
      const watchedMedia = new watchHistory({
        User: User_id,
        [media_type]: media_id,
      });
      try {
        const result = await watchedMedia.save();

        res.status(200).send({ History: result });
      } catch (e) {
        res.status(500).send("error in line 260 " + e);
      }
    } else {
      const watchedMovie = await watchHistory.findOneAndUpdate(
        { User: User_id },
        { $addToSet: { [media_type]: media_id } },
        { new: true }
      );
      try {
        const result = await watchedMovie.save();

        res.status(200).send({ History: result });
      } catch (e) {
        res.status(500).send("error in line 271 " + e);
      }
    }
  }

  async deleteWatchHistory(req, res) {
    var User_id = req.user._id;

    const history = await watchHistory.find({ User: User_id });
    console.log(history);
    if (history.length == 0) {
      res.status(200).send("Nothing to delete!!!");
    } else {
      const deletedHistory = await watchHistory.findOneAndDelete({
        User: User_id,
      });
      res.status(200).send("Your History has been Successfully deleted!!!");
    }
  }
}

module.exports = UserDomain;
