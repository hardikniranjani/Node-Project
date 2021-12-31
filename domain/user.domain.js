require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserModel, userValidation } = require("../models/Users/user.model");
const watchHistory = require("../models/Users/watchHistory.model");
const watchLater = require("../models/Users/watchLater.model");
const wishlist = require("../models/Users/wishlist.model");

const SubscriptionModel = require("../models/subscription.model");

class UserDomain {
  // create Admin
  async createAnAdmin(req, res) {
    const admin = req.body;
    const { error } = userValidation(admin);
    if (error) return res.status(500).send(error.details[0].message);

    const findAdmin = await UserModel.findOne({ Email: admin.email });

    if (findAdmin)
      return res.status(400).send({ msg: "User already registered" });

    const allUser = await UserModel.find().sort({ _id: -1 });

    let id = 1;

    if (allUser.length == 0) {
      id = 1;
    } else {
      id = allUser[0]._id + 1;
    }

    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(admin.password, salt);

    let newAdmin = new UserModel({
      _id: id,
      Name: admin.name,
      Email: admin.email,
      Password: newPassword,
      Role: "admin",
    });

    try {
      const result = await newAdmin.save();

      const token = jwt.sign(
        { _id: newAdmin._id, role: "admin" },
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

    const findUser = await UserModel.findOne({ Email: user.email }).populate(
      "Subscription_plan_id"
    );

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
        console.log(token, "line 124 user.domain");
        res.header("x-access-token", token).send(findUser);
      } else {
        res.status(400).send("Invalid Email Or Password!!!");
      }
    } else {
      res.status(404).send("Can't find User");
    }
  }

  // update an user
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
    let id = req.user._id;

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
    let id = req.params.id;

    if (!(req.user.role == "admin")) res.status(401).send("Access Denied!!!");

    const result = await UserModel.findById(id);

    if (result && result.IsActive) {
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
    if (req.user.role !== "admin")
      return res.status(401).send("Access Denied!!!");

    const result = await UserModel.find({ IsActive: true });

    if (result) res.status(200).send(result);
    else res.status(404).send("Can't find User");
  }

  // get all deleted users

  async getAllDeletedUsers(req, res) {
    if (req.user.role !== "admin") res.status(401).send("Access Denied!!!");

    const result = await UserModel.find({ IsActive: false });

    if (result) res.status(200).send(result);
    else res.status(404).send("Can't find User");
  }

  // ger user by Id

  // Hard Delete user by id
  async HardDeleteUser(req, res) {
    let id = req.params.id;

    const result = await UserModel.findByIdAndDelete(id);
    if (result) {
      res.send("Successfully deleted");
    } else {
      res.status(404).send("Can't find User");
    }
  }

  //   show watch History of user
  async showWatchHistory(req, res) {
    let User_id = req.user._id;

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
      })
      .sort();

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
          seasonid: obj.SeasonID._id,
          seasonName: obj.SeasonID.SeasonName,
        };
      }
    });

    res.status(200).send({
      movies: movieArray,
      episodes: episodeArray,
    });
  }

  //add Movie to watch History of user
  async addToWatchHistory(req, res) {
    let User_id = req.user._id;
    let media_id = req.query.media_id;
    let media_type = req.query.media_type;
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
      const updatedList = await watchHistory.findOneAndUpdate(
        { User: User_id },
        { $addToSet: { [media_type]: media_id } },
        { new: true }
      );
      try {
        const result = await updatedList.save();

        res.status(200).send({ History: result });
      } catch (e) {
        res.status(500).send("error in line 271 " + e);
      }
    }
  }

  // delete watch history of user
  async deleteWatchHistory(req, res) {
    let User_id = req.user._id;

    const history = await watchHistory.find({ User: User_id });
    console.log(history);
    if (history.length == 0) {
      res.status(200).send({ msg: "Nothing to delete!!!" });
    } else {
      const deletedHistory = await watchHistory.findOneAndDelete({
        User: User_id,
      });
      res
        .status(200)
        .send({ msg: "Your History has been Successfully deleted!!!" });
    }
  }

  //remove particular media
  async removeFromHisoty(req, res) {
    let User_id = req.user._id;
    let media_id = req.query.media_id;
    let media_type = req.query.media_type;
    const list = await watchHistory.find({ User: User_id });

    if (list.length == 0) {
      res.status(200).send({ msg: "No list is there." });
    } else {
      const deletedlist = await watchLater.findOneAndUpdate({
        User: User_id,
        $pull: {
          [media_type]: media_id,
        },
      });
      res
        .status(200)
        .send({ msg: "Your list has been Successfully updated!!!" });
    }
  }

  // add to watch history of user
  async addToWatchLater(req, res) {
    let User_id = req.user._id;
    let media_id = req.query.media_id;
    let media_type = req.query.media_type;
    media_type = media_type.charAt(0).toUpperCase() + media_type.slice(1);
    console.log([media_type]);
    const library = await watchLater.find({ User: User_id });

    if (library.length == 0) {
      const newlibrary = new watchLater({
        User: User_id,
        [media_type]: media_id,
      });
      try {
        const result = await newlibrary.save();
        res.status(200).send({ Library: result });
      } catch (e) {
        res.status(500).send("error in line 260 " + e);
      }
    } else {
      const updatedLibrary = await watchLater.findOneAndUpdate(
        { User: User_id },
        { $addToSet: { [media_type]: media_id } },
        { new: true }
      );
      try {
        const result = await updatedLibrary.save();

        res.status(200).send({ updatedLibrary: result });
      } catch (e) {
        res.status(500).send("error in line 271 " + e);
      }
    }
  }

  // show watch history of user
  async showWatchLater(req, res) {
    let User_id = req.user._id;

    const watchLaterList = await watchLater
      .find({ User: User_id })
      .populate("Movies")
      .populate({
        path: "Episode",
        populate: { path: "SeriesID" },
      })
      .populate({
        path: "Episode",
        populate: { path: "SeasonID" },
      })
      .sort();

    if (watchLaterList.length == 0)
      return res.status(404).send({ msg: "List is empty!!!" });

    const movieArray = watchLaterList[0]["Movies"].map((obj) => {
      if (obj.MovieName) {
        return { movie_name: obj.MovieName, movie_id: obj._id };
      }
    });

    const episodeArray = watchLaterList[0]["Episode"].map((obj) => {
      if (obj.EpisodeName) {
        return {
          episode_name: obj.EpisodeName,
          episode_id: obj._id,
          seriesid: obj.SeriesID._id,
          seriesName: obj.SeriesID.SeriesName,
          seasonid: obj.SeasonID._id,
          seasonName: obj.SeasonID.SeasonName,
        };
      }
    });

    res.status(200).send({
      movies: movieArray,
      episodes: episodeArray,
    });
  }

  // remove watch history of user
  async removeFromWatchLater(req, res) {
    let User_id = req.user._id;
    let media_id = req.query.media_id;
    let media_type = req.query.media_type;
    const list = await watchLater.find({ User: User_id });

    if (list.length == 0) {
      res.status(200).send({ msg: "No list is there." });
    } else {
      const deletedlist = await watchLater.findOneAndUpdate({
        User: User_id,
        $pull: {
          [media_type]: media_id,
        },
      });
      res
        .status(200)
        .send({ msg: "Your list has been Successfully updated!!!" });
    }
  }

  // add ro wishlist of user
  async addToWishList(req, res) {
    const User_id = req.user._id;
    const media_id = req.query.media_id;
    let media_type = req.query.media_type;

    const findWishList = await wishlist.find({ UserId: User_id });

    if (findWishList.length == 0) {
      const list = new wishlist({
        UserId: User_id,
        [media_type]: media_id,
      });
      try {
        const result = await list.save();
        res.status(200).send({ wishlist: result });
      } catch (e) {
        res.status(500).send({ msg: `error : ${e.message}` });
      }
    } else {
      const updateWishlist = await wishlist.findOneAndUpdate(
        { UserId: User_id },
        { $addToSet: { [media_type]: media_id } },
        { new: true }
      );

      try {
        const result = await updateWishlist.save();
        res.status(200).send({ wishlist: result });
      } catch (e) {
        res.status(500).send({ msg: `err : ${e.message}` });
      }
    }
  }

  // show wishlist of user
  async getWishList(req, res) {
    const user_id = req.user._id;

    const findWishList = await wishlist
      .find({ UserId: user_id })
      .populate("Series")
      .populate("Movies");

    if (findWishList.length == 0)
      return res.status(404).send({ msg: "Empty Wishlist" });

    const seriesArray = findWishList[0].Series.map((obj) => {
      if (obj.IsActive == true) {
        return {
          series_id: obj._id,
          series_name: obj.SeriesName,
          description: obj.ShortDescription,
          releasedata: obj.ReleaseDate,
        };
      }
    });

    const movieArray = findWishList[0].Movies.map((obj) => {
      if (obj.IsActive == true) {
        return {
          movie_id: obj._id,
          movie_name: obj.MovieName,
          description: obj.ShortDescription,
          releasedata: obj.ReleaseDate,
        };
      }
    });

    res.status(200).send({
      series: seriesArray,
      movies: movieArray,
    });
  }

  // remove wishlist of user
  async removeFromWishlist(req, res) {
    const user_id = req.user._id;
    const media_id = req.query.media_id;
    let media_type = req.query.media_type;
    const findUser = await wishlist.find({ UserId: user_id });

    if (findUser.length == 0) {
      res.status(404).send({ msg: "Empty wishlist!!!" });
    } else {
      await wishlist.findOneAndUpdate({
        UserId: user_id,
        $pull: {
          [media_type]: media_id,
        },
      });

      res.status(200).send({ msg: "Your wishlist deleted successfully." });
    }
  }

  // add subscription on user id
  async addSubscription(req, res) {
    const user_id = req.user._id;
    const plan_id = req.query.plan_id;

    const getPlan = await SubscriptionModel.findById(plan_id);

    if (!getPlan)
      return res.status(404).send({ msg: `Plan id ${plan_id} not found` });

    const findUser = await UserModel.findById(user_id);

    if (!findUser)
      return res
        .status(404)
        .send({ msg: "Can't find user. Please login again" });

    const addplanToUser = await UserModel.findByIdAndUpdate(
      { _id: user_id },
      {
        $set: {
          Subscription_plan_id: plan_id,
          Subscription_duration: 1,
        },
      },
      { new: true }
    );
    res.status(200).send(addplanToUser);
  }
}

module.exports = UserDomain;
