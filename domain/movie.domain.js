const MovieModel = require("../models/movie.model");
const path = require("path");

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

  // uplode movie video
  async uploadMovie(req, res) {
    const movie_id = req.query.movie_id;
    const pathToUpload = path.normalize(`${__dirname}/..`);
    const findMovie = await MovieModel.findById(movie_id);

    if (!findMovie)
      return res
        .status(400)
        .send({ msg: `Can't found movie with id ${movie_id}` });

    if (!req.files.banner || !req.files.video)
      return res.status(404).send({ msg: "Kindly upload all necessary data." });

    const banner = req.files.banner;
    const video = req.files.video;

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

    const vpath = `${pathToUpload}/public/Movies/videos/${findMovie.MovieName}.${videoType[1]}`;
    const bpath = `${pathToUpload}/public/Movies/images/${findMovie.MovieName}.${bannerType[1]}`;

    await video.mv(vpath, (err) => {
      if (err) return res.status(500).send({ msg: `error : ${err.message}` });
    });

    await banner.mv(bpath, (err) => {
      if (err) return res.status(500).send({ msg: `error : ${err.message}` });
    });

    const updateMovie = await MovieModel.findOneAndUpdate(
      { _id: movie_id },
      {
        $set: {
          Video_path: vpath,
          Banner: bpath,
        },
      },
      { new: true }
    );

    if (!updateMovie)
      return res.status(400).send({ msg: "not able to upload movie" });

    res.status(200).send({ movie: updateMovie });
  }

  // get all Movie
  async getAllMovie(req, res) {
    var Movie_data = await MovieModel.find({ IsActive: true });
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

  // sorting movie
  async sortMovie(req, res) {
    var category = req.query.sortBy;
    const result = await MovieModel.find()
      .populate("Genres")
      .populate("Spoken_languages")
      .populate("Production_companies")
      .sort(category);

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
          ...data,
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

  // find and movie series data
  async findMovieBySort(req, res) {
    const queryperam = req.query.filter;
    const Ascending = req.query.ascending;

    const movieData = await MovieModel.find()
      .populate("Genres")
      .populate("Spoken_languages")
      .populate("Production_companies")
      .sort(queryperam);

    if (!movieData) return res.status(404).send({ msg: `movie not found` });

    if (Ascending == "descending")
      return res.status(200).send(movieData.reverse());

    return res.status(200).send(movieData);
  }

  // search movie and filter results
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
