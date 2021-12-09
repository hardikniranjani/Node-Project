const UserModel = require("../models/Users/user.model");
const watchHistory = require("../models/Users/watchHistory.model");
const watchHistory = require("../models/Users/watchHistory.model");
const watchLater = require("../models/Users/watchLater.model");
const wishlist = require("../models/Users/wishlist.model");

class UserDomain {
  // create Admin
  async createAnAdmin(req, res) {
    const Admin = req.body;
    const { error } = UserModel.userValidation(Admin);

    if (error) return res.send("error");
  }

  // create new user domain
  async createAnUser(req, res) {
    const user = req.body;
    const { error } = validateUser(c);
    if (error) return res.status(500).send(error.details[0].message);

    const findUser = await UserModel.findOne({ Email: user.Email });
    if (findUser) return res.status(400).send("User already registered");

    const allUser = await UserModel.find().sort({ _id: -1 });
    let id;
    if (allUser.length == 0) {
      id = 1;
    } else {
      id = allUser[0]._id + 1;
    }
    let user = new users({
      _id: id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      password: c.password,
      role: c.role,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    try {
      const result = await user.save();
      const token = jwt.sign(
        { _id: user._id, role: user.role },
        config.secretKey,
        {
          algorithm: config.algorithm,
          expiresIn: "1h",
        }
      );
      console.log(token);
      res.header("x-access-token", token).send(result);
    } catch (e) {
      res.send(e.message);
    }
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

    const result = await UserModel.findByIdAndDelete(id);
    if (result) {
      res.send("Successfully deleted");
    } else {
      res.status(404).send("Can't find User");
    }
  }

  //   show watch History of user
  async showWatchHistory(req, res) {
    var User_id = req.decoded._id;

    const history = await watchHistory
      .find({ User: User_id })
      .populate("Movies")
      .populate({
        path: "Episode",
        populate: { path: "Series_Number" },
      })
      .populate({
        path: "Episode",
        populate: { path: "Season_Number" },
      });

    if (history) {
      const movieArray = history.map((obj) => {
        if (obj.MovieName) {
          return obj.MovieName;
        }
      });
      const episodeArray = history.map((obj) => {
        if (obj.EpisodeName) {
          return { name: obj.EpisodeName };
        }
      });
      res.status(200).send({});
    } else {
      res.send("History not available");
    }
  }

  //add Movie to watch History of user
  async addToWatchHistoryMovie(req, res) {
    var User_id = req.decoded._id;
    var movie_id = req.query.movie_id;

    const history = await watchHistory.find({ User: User_id });

    if (history.length == 0) {
      const watchedMovie = new watchHistory({
        User: User_id,
        Movies: movie_id,
      });
      try {
        const result = await watchedMovie.save();
        res.status(200).send(result);
      } catch (e) {
        res.status(500).send(e);
      }
    } else {
      const watchedMovie = await watchHistory.findOneAndUpdate(
        { User: User_id },
        { $addToSet: { Movies: movie_id } }
      );
      try {
        const result = await watchedMovie.save();
        res.status(200).send(result);
      } catch (e) {
        res.status(500).send(e);
      }
    }
  }

  async addToWatchHistoryEpisode(req, res) {
    var User_id = req.decoded._id;
    var episode_id = req.query.episode_id;

    const history = await watchHistory.find({ User: User_id });

    if (history.length == 0) {
      const watchedEpisode = new watchHistory({
        User: User_id,
        Episode: episode_id,
      });
      try {
        const result = await watchedEpisode.save();
        res.status(200).send(result);
      } catch (e) {
        res.status(500).send(e);
      }
    } else {
      const watchedEpisode = await watchHistory.findOneAndUpdate(
        { User: User_id },
        { $addToSet: { Episode: episode_id } }
      );
      try {
        const result = await watchedEpisode.save();
        res.status(200).send(result);
      } catch (e) {
        res.status(500).send(e);
      }
    }
  }

  async deleteWatchHistory(req,res) {
    var User_id = req.decoded._id;

    const history = await watchHistory.find({ User: User_id });

    if (history.length == 0) {
      res.status(200).send("Nothing to delete!!!");
    } 
    else {
      const deletedHistory = await watchHistory.findByIdAndDelete({ User: User_id });
      res.status(200).send(deletedHistory);
    }
  }
}

module.exports = User;
