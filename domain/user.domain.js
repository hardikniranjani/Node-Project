require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserModel, userValidation } = require("../models/Users/user.model");
const watchHistory = require("../models/Users/watchHistory.model");
const watchLater = require("../models/Users/watchLater.model");
const wishlist = require("../models/Users/wishlist.model");
const nodemailer = require("nodemailer");
const SubscriptionModel = require("../models/subscription.model");
const shortid = require("shortid");
const Razorpay = require("razorpay");
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

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

  async signUpEmail(req, res) {
    console.log("email", req.body, "line 64 user.domain");
    const email = req.body.email;
    const findUser = await UserModel.findOne({ Email: email });

    if (findUser) return res.status(400).send("User already registered");

    const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "15m",
    });

    const link = `http://localhost:8080/signup/${token}`;

    let transporter = nodemailer.createTransport({
      // host: "smtp.gmail.com",
      // port: 587,
      // secure: true,
      // requireTLS: true,
      service: "gmail",
      auth: {
        user: "dilipkumavat1807@gmail.com",
        pass: process.env.gmail,
      },
      from: "dilipkumavat1807@gmail.com",
    });

    let mailOptions = {
      from: "dilipkumavat1807@gmail.com",
      to: email,
      subject: "Ottplatform Account signup",
      html: `<p>Hey, We have received a request to sing up on ottplatform.com, so if you have requested that, then please <a href=${link}>click here</a> to verify account</p>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        return res.status(501).send(err);
      } else {
        console.log(`Email sent :`, info.response);
      }
    });
    return res.send(link);
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

    const findUser = await UserModel.findOne({
      Email: user.email,
      IsActive: true,
    })
      .populate({
        path: "watchHistory",
        populate: {
          path: "Movies",
          model: "Movies",
        },
        populate: {
          path: "Episode",
          model: "episode",
        },
      })
      .populate("Subscription_plan_id")
      .populate({
        path: "watchLater",
        populate: {
          path: "Movies",
          model: "Movies",
        },
        populate: {
          path: "Episode",
          model: "episode",
        },
      })
      .populate({
        path: "wishlist",
        populate: {
          path: "Movies",
          model: "Movies",
        },
        populate: {
          path: "Series",
          model: "series",
        },
      });

    if (findUser && findUser.IsActive) {
      if (bcrypt.compareSync(user.password, findUser.Password)) {
        const token = jwt.sign(
          { _id: findUser._id, role: findUser.Role },
          process.env.ACCESS_TOKEN_SECRET,
          {
            algorithm: "HS256",
          }
        );

        res.header("x-access-token", token).send(findUser);
      } else {
        res.status(400).send({ msg: "Invalid Email Or Password!!!" });
      }
    } else {
      res.status(404).send({ msg: "Can't find User" });
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
      res.status(501).send({ msg: "User not found" });
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
    )
      .populate({
        path: "watchHistory",
        populate: {
          path: "Movies",
          model: "Movies",
        },
        populate: {
          path: "Episode",
          model: "episode",
        },
      })
      .populate("Subscription_plan_id")
      .populate({
        path: "watchLater",
        populate: {
          path: "Movies",
          model: "Movies",
        },
        populate: {
          path: "Episode",
          model: "episode",
        },
      })
      .populate({
        path: "wishlist",
        populate: {
          path: "Movies",
          model: "Movies",
        },
        populate: {
          path: "Series",
          model: "series",
        },
      });

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
      await watchHistory.findOneAndUpdate(
        { User: id },
        {
          $set: {
            IsActive: false,
          },
        }
      );

      await watchLater.findOneAndUpdate(
        { User: id },
        {
          $set: {
            IsActive: false,
          },
        }
      );
      await wishlist.findOneAndUpdate(
        { UserId: id },
        {
          $set: {
            IsActive: false,
          },
        }
      );

      res.send({ msg: "Successfully deleted" });
    } else {
      res.status(404).send({ msg: "Can't find User" });
    }
  }

  // soft delete of user by admin side
  // delete user by id
  async deleteAnUserByAdmin(req, res) {
    let id = req.params.id;

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
    const result = await UserModel.find({ IsActive: true });

    if (result) res.status(200).send({ allUser: result });
    else res.status(404).send("Can't find User");
  }

  // get all deleted users

  async getAllDeletedUsers(req, res) {
    const result = await UserModel.find({ IsActive: false });

    if (result) res.status(200).send(result);
    else res.status(404).send("Can't find User");
  }

  // ger user by Id

  // Hard Delete user by id
  async HardDeleteUser(req, res) {
    let id = req.params.id;

    const result = await UserModel.findOne({ _id: id, IsActive: false });
    if (!result) return res.status(404).send({ msg: "Can't find User" });
    const deleteUser = await UserModel.deleteOne({ _id: id });
    if (deleteUser) {
      res.send({ msg: "Successfully deleted" });
    } else {
      res.status(404).send({ msg: "Can't find User" });
    }
  }

  //   show watch History of user
  async showWatchHistory(req, res) {
    let User_id = req.user._id;

    const history = await watchHistory
      .find({ User: User_id, IsActive: true })
      .populate("Movies")
      .populate({
        path: "Episode",
        populate: { path: "SeriesID" },
      });
    // .populate({
    //   path: "Episode",
    //   populate: { path: "SeasonID" },
    // })
    // .sort();

    if (history.length == 0)
      return res.status(404).send({ msg: "History not available" });

    const movieArray = history[0]["Movies"].map((obj) => {
      if (obj.MovieName) {
        return {
          movie_name: obj.MovieName,
          WatchHistory_id: obj._id,
          _id: obj._id,
          Banner: obj.Banner,
          backdrop_path: obj.backdrop_path,
        };
      }
    });

    const episodeArray = history[0]["Episode"].map((obj) => {
      if (obj.EpisodeName) {
        return {
          episode_name: obj.EpisodeName,
          _id: obj._id,
          WatchHistory_id: obj._id,
          seriesid: obj.SeriesID._id,
          seriesName: obj.SeriesID.SeriesName,
          seasonid: obj.SeasonID._id,
          seasonName: obj.SeasonID.SeasonName,
          Banner: obj.Banner,
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

    const history = await watchHistory.find({ User: User_id, IsActive: true });

    if (history.length == 0) {
      const watchedMedia = new watchHistory({
        User: User_id,
        [media_type]: media_id,
      });
      try {
        const result = await watchedMedia.save();

        await UserModel.findOneAndUpdate(
          { _id: User_id },
          { watchHistory: result._id.toString() }
        );
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
  async removeFromHistory(req, res) {
    let User_id = req.user._id;
    let media_id = req.query.media_id;
    let media_type = req.query.media_type;
    const list = await watchHistory.find({ User: User_id, IsActive: true });

    if (list.length == 0) {
      res.status(200).send({ msg: "No list is there." });
    } else {
      const deletedlist = await watchHistory.findOneAndUpdate({
        User: User_id,
        $pull: {
          [media_type]: media_id,
        },
      });
      res.status(200).send({
        list: deletedlist,
      });
    }
  }

  // add to watch history of user
  async addToWatchLater(req, res) {
    let User_id = req.user._id;
    let media_id = req.query.media_id;
    let media_type = req.query.media_type;
    // media_type = media_type.charAt(0).toUpperCase() + media_type.slice(1);
    // console.log([media_type]);
    const library = await watchLater.find({ User: User_id, IsActive: true });

    if (library.length == 0) {
      const newlibrary = new watchLater({
        User: User_id,
        [media_type]: media_id,
      });
      try {
        const result = await newlibrary.save();
        await UserModel.findOneAndUpdate(
          { _id: User_id },
          {
            watchLater: result._id.toString(),
          }
        );
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

  //remove particular episode or movie from watchlater
  async remove_watch_later(req, res) {
    let User_id = req.user._id;
    let media_id = req.query.media_id;
    let media_type = req.query.media_type;
    const list = await watchLater.find({ User: User_id, IsActive: true });

    if (list.length == 0) {
      res.status(200).send({ msg: "No list is there." });
    } else {
      const deletedlist = await watchLater.findOneAndUpdate(
        { User: User_id },
        {
          $pull: {
            [media_type]: media_id,
          },
        },
        { new: true }
      );
      res.status(200).send({
        list: deletedlist,
      });
    }
  }

  //delete watch later list
  async deleteWatchLater(req, res) {
    let User_id = req.user._id;

    const list = await watchLater.find({ User: User_id });

    if (list.length == 0) {
      res.status(200).send({ msg: "Nothing to delete!!!" });
    } else {
      const deletedlist = await watchLater.findOneAndDelete({
        User: User_id,
      });
      res
        .status(200)
        .send({ msg: "Your watch later has been Successfully deleted!!!" });
    }
  }

  // show watch history of user
  async showWatchLater(req, res) {
    let User_id = req.user._id;

    const watchLaterList = await watchLater
      .find({ User: User_id, IsActive: true })
      .populate("Movies")
      .populate({
        path: "Episode",
        populate: { path: "SeriesID" },
      })
      // .populate({
      //   path: "Episode",
      //   populate: { path: "SeasonID" },
      // })
      .sort();

    if (watchLaterList.length == 0)
      return res.status(404).send({ msg: "List is empty!!!" });

    const movieArray = watchLaterList[0]["Movies"].map((obj) => {
      if (obj.MovieName) {
        return {
          movie_name: obj.MovieName,
          _id: obj._id,
          WatchLater_id: obj._id,
          Banner: obj.Banner,
          backdrop_path: obj.backdrop_path,
        };
      }
    });

    const episodeArray = watchLaterList[0]["Episode"].map((obj) => {
      if (obj.EpisodeName) {
        return {
          episode_name: obj.EpisodeName,
          _id: obj._id,
          WatchLater_id: obj._id,
          seriesid: obj.SeriesID._id,
          seriesName: obj.SeriesID.SeriesName,
          seasonid: obj.SeasonID._id,
          seasonName: obj.SeasonID.SeasonName,
          Banner: obj.Banner,
        };
      }
    });

    res.status(200).send({
      movies: movieArray,
      episodes: episodeArray,
    });
  }

  // add ro wishlist of user
  async addToWishList(req, res) {
    const User_id = req.user._id;
    const media_id = req.query.media_id;
    const media_type = req.query.media_type;

    const findWishList = await wishlist.find({ UserId: User_id });

    if (findWishList.length == 0) {
      const list = new wishlist({
        UserId: User_id,
        [media_type]: media_id,
      });
      try {
        const result = await list.save();
        // console.log(result, 'line 669');
        await UserModel.findOneAndUpdate(
          { _id: User_id },
          {
            wishlist: result._id.toString()
          }
        );
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
          _id: obj._id,
          WishList_id: obj._id,
          series_name: obj.SeriesName,
          description: obj.ShortDescription,
          releasedata: obj.ReleaseDate,
          Banner: obj.Banner,
          backdrop_path: obj.backdrop_path,
        };
      }
    });

    const movieArray = findWishList[0].Movies.map((obj) => {
      if (obj.IsActive == true) {
        return {
          _id: obj._id,
          WishList_id: obj._id,
          movie_name: obj.MovieName,
          description: obj.ShortDescription,
          releasedata: obj.ReleaseDate,
          Banner: obj.Banner,
          backdrop_path: obj.backdrop_path,
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

  async removeOneWishList(req, res) {
    let User_id = req.user._id;
    let media_id = req.query.media_id;
    let media_type = req.query.media_type;
    const list = await wishlist.find({ User: User_id });

    if (list.length == 0) {
      res.status(200).send({ msg: "No list is there." });
    } else {
      const deletedlist = await wishlist.findOneAndUpdate({
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

  async createOrder(req, res) {
    // console.log("amount ",req.query.amount);
    var order = await razorpay.orders.create({
      amount: req.query.amount,
      currency: process.env.RAZORPAY_DEFAULT_CURRENCY,
      receipt: `Receipt-${shortid.generate()}`,
    });

    res.status(200).send({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    });
  }

  // add subscription on user id
  async addSubscription(req, res) {
    const user_id = req.user._id;
    const plan_id = Number(req.query.plan_id);
    const data = req.body.data;
    console.log(data);
    const getPlan = await SubscriptionModel.findById(plan_id);
    // console.log(getPlan);
    if (!getPlan)
      return res.status(404).send({ msg: `Plan id ${plan_id} not found` });

    const findUser = await UserModel.findById(user_id);

    if (!findUser)
      return res
        .status(404)
        .send({ msg: "Can't find user. Please login again" });
    let date = new Date();
    let purchase_date = new Date().valueOf();
    let expiry_date = new Date().setDate(date.getDate() + 29);
    
    // console.log(expiry_date,purchase_date, "expiry_date");
    // console.log(new Date(purchase_date).toString()," by toString method");
    // Tue Feb 01 2022 17:27:06 GMT+0530 (India Standard Time) by toString method
    // console.log(new Date(expiry_date).toLocaleString(),"by toLocaleString method");
    // 2/3/2022, 5:36:19 pm by toLocaleString method
    const addplanToUser = await UserModel.findByIdAndUpdate(
      { _id: user_id },
      {
        $set: {
          Subscription_plan_id: plan_id,
          Plan_Purchase_Date_Time: purchase_date,
          Plan_Expiry_Date_Time: expiry_date,
          Payment_ID : data.razorpay_payment_id,
          Order_ID : data.razorpay_order_id
        },
      },
      { new: true }
    ).populate("Subscription_plan_id");
    res.status(200).send(addplanToUser);
  }
}

module.exports = UserDomain;