const mongoose = require("mongoose");

var mongoDB = "mongodb://localhost/backend";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const episodeSchema = new mongoose.Schema({
  _id: {
    type: Number,
  },
  EpisodeName: {
    type: String,
  },
  EpisodeNumber: {
    type: Number,
    min: 1,
  },
  ShortDescription: {
    type: String,
  },
  Series_Number: {
    type: Number,
    ref: "series",
  },
  Season_Number: {
    type: Number,
    ref: "seasons",
  },
  Poster_path: {
    type: String,
  },
  Video_path: {
    type: String,
  },
  Vote_average: {
    type: Number,
  },
  Vote_count: {
    type: Number,
  },
  IsActive: {
    type: Boolean,
    default: true,
  },
});

const Episode = new mongoose.model("episode", episodeSchema);

module.exports = Episode;
