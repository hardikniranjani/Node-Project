const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  MovieName: {
    type: String,
    required: true,
  },
  Original_language: {
    type: String,
    required: true,
  },
  Spoken_languages: {
    type: [Number],
    ref: "Language",
  },
  Budget: {
    type: String,
    required: true,
  },
  ShortDescription: {
    type: String,
    required: true,
    minlength: 100,
  },
  Genres: {
    required: true,
    type: [Number],
    ref: "genres",
  },
  //  enum:["Drama", "Adventure", "Comedy", "Action","Classic","Anime","Crime and mystery","Documentaries","Thriller","Romance"],
  ReleaseDate: {
    type: Date,
    required: true,
  },
  Popularity: {
    type: Number,
    required: true,
  },
  DirectorName: {
    type: [String],
    required: true,
  },
  Production_companies: {
    type: [Number],
    ref: "Companies",
    required: true,
  },
  Revenue: {
    type: String,
  },
  Status: {
    type: String,
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
  Video_path : {
    type : String
  },
  Banner: {
    type: String,
  },
  IsActive: {
    type: Boolean,
    default: true,
  },
});

const Movie = mongoose.model("Movies", movieSchema);

module.exports =  Movie ;
  