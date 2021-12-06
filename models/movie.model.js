const mongoose = require("mongoose");
var mongoDB = "mongodb://localhost/backend";

mongoose
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("DB runing");
  })
  .catch((err) => {
    console.log("Database error occurred " + err);
  });

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
    type: Number,
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
});

const Movie = mongoose.model("movies", movieSchema);

module.exports =  Movie ;
