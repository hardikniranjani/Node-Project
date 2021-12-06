const mongoose = require("mongoose");
const Joi = require("joi");

var mongoDB = "mongodb://localhost/backend";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const seriesSchema = new mongoose.Schema({
  _id: {
    type: Number,
  },
  SeriesName: {
    type: String,
  },
  Original_language: {
    type: String,
  },
  Spoken_languages: {
    type: [Number],
    ref: "spoken_languages",
  },
  Budget: {
    type: Number,
  },
  ShortDescription: {
    type: String,
  },
  Category: {
    type: [Number],
    ref: "genres",
  },
  Number_of_episodes:{
    type: Number,
  },
  Number_of_seasons:{
    type: Number,
  },
  ReleaseDate: {
    type: Date,
  },
  Popularity: {
    type: Number,
  },
  Poster_path:{
    type: String,
  },
  Production_companies: {
    type: [Number],
    ref: "compaines",
  },
  Revenue: {
    type: Number,
  },
  Status: {
    type: String,
  },
  DirectorName: {
    type: [String],
  },
  Seasons: {
    type: [Number],
    ref: "seasons",
  },
  Vote_average: {
    type: Number,
  },
  Vote_count: {
    type: Number,
  },
  LongDescription: {
    type: String,
  }
});

const Series = mongoose.model("series", seriesSchema);

module.exports = Series;
