const mongoose = require("mongoose");
const Joi = require("joi");

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
    type: String,
  },
  ShortDescription: {
    type: String,
  },
  Genres: {
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
    type: [String],
  },
  Production_companies: {
    type: [Number],
    ref: "compaines",
  },
  Revenue: {
    type: String,
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
  },
  IsActive: {
    type: Boolean,
    default: true,
  },
});

const Series = mongoose.model("series", seriesSchema);

module.exports = Series;
