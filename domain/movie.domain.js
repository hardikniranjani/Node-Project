const MovieModel = require("../models/movie.model");

class MovieDomain {
  // create movie
  async createAnMovie(req, res) {
    var data = req.body;

    let Movie = new MovieModel({
      _id: data._id,
      MovieName: data.MovieName,
      Original_language: data.Original_language,
      Spoken_languages: data.Spoken_languages,
      DirectorName: data.DirectorName,
      Budget: data.Budget,
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

    try {
      const newMovie = await Movie.save();
      if (newMovie) {
        return res.send(newMovie);
      } else {
        return res.status(400).send("We can't create a new Movie");
      }
    } catch (e) {
      res.status(500).send(`some error ${e}`);
    }
  }

  async uploadMovie(req, res) {
    const movie_id = req.query.movie_id;

    const findMovie = await MovieModel.findById(movie_id);

    if (!findMovie)
      return res
        .status(400)
        .send({ msg: `Can't found movie with id ${movie_id}` });
    
    if (!req.files.banner || !req.files.video)
      return res.status(404).send({ msg: "Kindly upload all necessary data." });

    const banner = req.files.banner;
    const video = req.files.video;

    let movie_path = {
      videoPath: "",
      bannerPath: "",
    };

    const bannerType = banner.mimetype.split("/");

    if (bannerType[0] !== "image")
      return res
        .status(400)
        .send({ msg: "Make sure your banner must be an image." });

    const videoType = video.mimetype.split("/");

    if (videoType[0] !== "video")
      return res
        .status(400)
        .send({ msg: "Make sure your video must be an video." });

    await video.mv(
      `${__dirname}/public/videos/${findMovie.MovieName}.${videoType[1]}`,
      (err) => {
        if (err) return res.status(500).send({ msg: `error : ${err.message}` });
        movie_path.videoPath = `${__dirname}/public/videos/${findMovie.MovieName}.${videoType[1]}`;
      }
    );

    await banner.mv(
      `${__dirname}/public/images/${findMovie.MovieName}.${bannerType[1]}`,
      (err) => {
        if (err) return res.status(500).send({ msg: `error : ${err.message}` });
        movie_path.bannerPath = `${__dirname}/public/images/${findMovie.MovieName}.${bannerType[1]}`;
      }
    );

    const updateMovie = await MovieModel.findOneAndUpdate(
      { _id: movie_id },
      {
        $set: {
          Video_path : movie_path.videoPath,
          Banner : movie_path.bannerPath,
        },
      },
      { new: true }
    );

    if(!updateMovie) return res.status(400).send({msg : "not able to upload movie"});

    console.log(updateMovie , "line 104");
    console.log(movie_path, "line 105");
    res.status(200).send({movie : updateMovie});
  }
  // get all Movie
  async getAllMovie(req, res) {
    var Movie_data = await MovieModel.find({IsActive: true});
    if (Movie_data.length > 0 ) {
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

  async sortMovie(req, res) {
    var category = req.query.sortBy;
    const result = await MovieModel.find()
      .populate("Genres")
      .populate("Spoken_languages")
      .populate("Production_companies")
      .sort(-category);

    res.send(result);
  }

  //soft delete Movie by id
  async deleteAnMovie(req, res) {
    var id = req.params.id;

    const result = await MovieModel.findByIdAndUpdate(id, {
      $set: {
        IsActive: false,
      },
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
    const UpdateMovie = await MovieModel.findByIdAndUpdate(
      id,
      {
        $set: {
          _id: data._id,
          MovieName: data.MovieName,
          Original_language: data.Original_language,
          Spoken_languages: data.Spoken_languages,
          DirectorName: data.DirectorName,
          Budget: data.Budget,
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
      },
      { new: true }
    );

    if (UpdateMovie) {
      res.send(UpdateMovie);
    } else {
      res.send("Can't update Movie");
    }
  }

  // // find movie by popularity
  // async findMovieByPopularity(req, res) {
  //   const queryperam = req.query.popularity;
  //   const movieData = await MovieModel.find().sort(`-${queryperam}`);

  //   if (!movieData) res.status(404).send({ msg: `Movies not found` });

  //   res.status(200).send(movieData);
  // }

  // find and filter movie data by Name, Revenue,Vote_average,Vote_count,Budget,popularity
  async findMovieBySort(req, res) {
    const queryperam = req.query.filter;
    const Ascending = req.query.ascending;

    const movie = await MovieModel.find();

    if (!movie) return res.status(404).send({ msg: `Movies not found` });

    if (Ascending == "ascending") {
      const movieData = await MovieModel.find()
        .populate("Genres")
        .populate("Spoken_languages")
        .populate("Production_companies")
        .sort(`${queryperam}`);
      return res.status(200).send(movieData);
    } else if (Ascending == "descending") {
      const movieData = await MovieModel.find()
        .populate("Genres")
        .populate("Spoken_languages")
        .populate("Production_companies")
        .sort(`-${queryperam}`);
      return res.status(200).send(movieData);
    } else {
      const movieData = await MovieModel.find()
        .populate("Genres")
        .populate("Spoken_languages")
        .populate("Production_companies")
        .sort(`${queryperam}`);
      return res.status(200).send(movieData);
    }

    // if(queryperam == 'Revenue' && Ascending == 'ascending'){
    //   const movieData = await MovieModel.find().sort(`${queryperam}`);
    //   return  res.status(200).send(movieData);
    // }
    // else if(queryperam == 'Revenue' && Ascending == 'descending'){
    //   const movieData = await MovieModel.find().sort(`-${queryperam}`);
    //   return  res.status(200).send(movieData);
    // }
    // else if(queryperam == 'Budget' && Ascending == 'ascending'){
    //   const movieData = await MovieModel.find().sort(`${queryperam}`);
    //   return  res.status(200).send(movieData);
    // }
    // else if(queryperam == 'Budget' && Ascending == 'descending'){
    //   const movieData = await MovieModel.find().sort(`-${queryperam}`);
    //   return  res.status(200).send(movieData);
    // }
    // else if(queryperam == 'Vote_average' && Ascending == 'ascending'){
    //   const movieData = await MovieModel.find().sort(`${queryperam}`);
    //   return  res.status(200).send(movieData);
    // }
    // else if(queryperam == 'Vote_average' && Ascending == 'descending'){
    //   const movieData = await MovieModel.find().sort(`-${queryperam}`);
    //   return  res.status(200).send(movieData);
    // }
    // else if(queryperam == 'Vote_count' && Ascending == 'ascending'){
    //   const movieData = await MovieModel.find().sort(`${queryperam}`);
    //   return  res.status(200).send(movieData);
    // }
    // else if(queryperam == 'Vote_count' && Ascending == 'descending'){
    //   const movieData = await MovieModel.find().sort(`-${queryperam}`);
    //   return  res.status(200).send(movieData);
    // }
    // else if(queryperam == 'Popularity' && Ascending == 'ascending'){
    //   const movieData = await MovieModel.find().sort(`${queryperam}`);
    //   return  res.status(200).send(movieData);
    // }
    // else if(queryperam == 'Popularity' && Ascending == 'descending'){
    //   const movieData = await MovieModel.find().sort(`-${queryperam}`);
    //   return  res.status(200).send(movieData);
    // }
  }

  // search movie by Original_language
  async findMovieBySearch(req, res) {
    const queryperam = req.query.item1;
    const queryName = req.query.item;

    const movieData = await MovieModel.find({ [queryperam]: queryName })
      .populate("Genres")
      .populate("Spoken_languages")
      .populate("Production_companies")
      .sort(`${queryperam}`);

    if (movieData.length <= 0)
      res.status(500).send({ msg: `Movies not found` });

    res.status(200).send(movieData);
  }
}

module.exports = MovieDomain;
