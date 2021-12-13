const mongoose = require("mongoose");
var mongoDB = "mongodb://localhost/backend";



const movieSchema = new mongoose.Schema({
  _id: {
    type: Number,
  },
  MovieName: {
    type: String,
  },
  Original_language: {
    type: String,
  },
  Spoken_languages: {
    type: [Number],
    ref: 'spoken_languages',
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
  //  enum:["Drama", "Adventure", "Comedy", "Action","Classic","Anime","Crime and mystery","Documentaries","Thriller","Romance"],
  ReleaseDate: {
    type: Date,
  },
  Popularity: {
    type: Number,
  },
  DirectorName: {
    type: [String],
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
  Vote_average: {
    type: Number,
  },
  Vote_count: {
    type: Number,
  },
  LongDescription: {
    type: String,
  },
  Banner: {
    type: String,
  },
  IsActive: {
    type: Boolean,
    default: true
}
});

const Movie = mongoose.model("movies", movieSchema);

module.exports =  Movie ;
