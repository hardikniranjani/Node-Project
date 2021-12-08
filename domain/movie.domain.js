const MovieModel = require("../models/movie.model");

class MovieDomain {
  // create movie
  async createAnMovie(req, res) {
    var data = req.body;

    let Movie = new MoviesModel({
      _id: data._id,
      MovieName: data.MovieName,
      Original_language: data.Original_language,
      Spoken_languages: data.Spoken_languages,
      DirectorName: data.DirectorName,
      budget: data.budget,
      ShortDescription: data.ShortDescription,
      Genres: data.Genres,
      ReleaseDate: data.ReleaseDate,
      Popularity: data.Popularity,
      Production_companies: data.Production_companies,
      Revenue: data.Revenue,
      Status: data.Status,
      Vote_average: data.Vote_average,
      Vote_count: data.Vote_count,
      LongDescription: data.LongDescription,
      Banner: data.Banner,
    });

    const newMovie = await Movie.save();
    if (newMovie) {
      return res.send(newMovie);
    } else {
      return res.send("We can't create a new Movie");
    }
  }

  // get all Movie
  async getAllMovie(req, res) {
    var Movie_data = await MovieModel.find();
    if (Movie_data.length > 0) {
      res.send(Movie_data);
    } else {
      res.send("not found");
    }
  }

  // get Movie by id
  async getAnMovie(req, res) {
    var id = req.params.id;

    const result = await MovieModel.findById(id);
    if (result) {
      res.send(result);
    } else {
      res.status(404).send("Can't find Movie");
    }
  }

  // delete Movie by id
  async deleteAnMovie(req, res) {
    var id = req.params.id;

    const result = await MovieModel.findByIdAndUpdate(id,{
        $set:{
          IsActive:false
        }
    });
    if (result) {
      res.send("Successfully deleted");
    } else {
      res.status(404).send("Can't find Movie");
    }
  }

    // Hard Delete Movie by id
    async hardDeleteMovie(req, res) {
      var id = req.params.id;
  
      const result = await Movies.findByIdAndDelete(id);
      if (result) {
        res.send("Successfully deleted");
      } else {
        res.status(404).send("Can't find Movie");
      }
    }

  // Edit Movie
  async editAnMovie(req, res) {
    var data = req.body;
    const id = req.params.id;

      const Movie = await MovieModel.findById(id);
      if (!Movie) res.send("Movie Not Found");
        const UpdateMovie = await MovieModel.findByIdAndUpdate(id, {
          $set: {
            _id: data._id,
            MovieName: data.MovieName,
            Original_language: data.Original_language,
            Spoken_languages: data.Spoken_languages,
            DirectorName: data.DirectorName,
            budget: data.budget,
            ShortDescription: data.ShortDescription,
            Genres: data.Genres,
            ReleaseDate: data.ReleaseDate,
            Popularity: data.Popularity,
            Production_companies: data.Production_companies,
            Revenue: data.Revenue,
            Status: data.Status,
            Vote_average: data.Vote_average,
            Vote_count: data.Vote_count,
            LongDescription: data.LongDescription,
            Banner: data.Banner,
          },
        }, {new:true})

        if(UpdateMovie){
            res.send(UpdateMovie)
        }
        else{
            res.send("Can't update Movie")
        }
      
    
  }
}

module.exports = MovieDomain;
