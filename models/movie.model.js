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
  Description: {
    type: String, 
    required: true,
    minlength: 50,
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
  Production_companies: {
    type: [Number],
    ref: "Companies",
    required: true,
  },
  Vote_average: {
    type: Number,
  },
  Vote_count: {
    type: Number,
  },
  Video_path : {
    type : String
  },
  Banner: {
    type: String,
  },
  backdrop_path: {
    type: String,
  },
  IsActive: {
    type: Boolean,
    default: true, 
  },
});

const Movie = mongoose.model("Movies", movieSchema);

module.exports =  Movie;