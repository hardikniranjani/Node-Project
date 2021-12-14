const mongoose = require("mongoose");

const seasonSchema = new mongoose.Schema({
  _id: {
    type: Number,
  },
  SeasonName: {
    type: String,
  },
  SeasonNumber: {
    type: Number,
    min: 1,
  },
  ShortDescription: {
    type: String,
  },
  Number_of_episodes:{
    type: Number,
  },
  Vote_average: {
    type: Number,
  },
  Vote_count: {
    type: Number,
  },
  Poster_path:{
    type: String,
  },
  Episodes: {
    type: [Number],
    ref: "episode",
  },
  IsActive: {
    type: Boolean,
    default: true,
  },
});

const Season = new mongoose.model("Seasons", seasonSchema);

module.exports = Season;
