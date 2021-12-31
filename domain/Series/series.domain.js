const Series = require("../../models/Series/series.model");

class SeriesDomain {
  // create new Series
  async createAnSeries(req, res) {
    var data = req.body;

    let series = new Series({
      _id: data._id,
      SeriesName: data.SeriesName,
      Original_language: data.Original_language,
      Spoken_languages: data.Spoken_languages,
      Budget: data.Budget,
      ShortDescription: data.ShortDescription,
      Genres: data.Genres,
      Number_of_seasons: data.Number_of_seasons,
      Number_of_episodes: data.Number_of_episodes,
      ReleaseDate: data.ReleaseDate,
      Popularity: data.Popularity,
      Production_companies: data.Production_companies,
      Revenue: data.Revenue,
      Status: data.Status,
      DirectorName: data.DirectorName,
      Vote_average: data.Vote_average,
      Vote_count: data.Vote_count,
      LongDescription: data.LongDescription,
      Season: data.Season,
      Poster_path: data.Poster_path,
      IsActive: data.IsActive,
    });

    const newSeries = await series.save();
    if (newSeries) {
      return res.send(newSeries);
    } else {
      return res.send("We can't create a new series");
    }
  }

  // get all series
  async getAllSeries(req, res) {
    var series_data = await Series.find();
    if (series_data.length > 0) {
      res.send(series_data);
    } else {
      res.send("not found");
    }
  }

  // get series by id
  async getAnSeries(req, res) {
    var id = req.params.id;

    const result = await Series.findById(id);
    if (result) {
      res.send(result);
    } else {
      res.status(404).send("Can't find series");
    }
  }

  // Delete series by Id
  
  async deleteAnSeries(req, res) {
    var id = req.params.id;
    const result = await Series.findByIdAndUpdate(id,{
      $set:{
        IsActive: false,
    }
    },{ new: true});

    if (!result) return res.status(404).send({ msg: `Series not found` });  

    res.send(200).send(result);
  }

  // Hard Delete series by id
  async HardDeleteSeries(req, res) {
    var id = req.params.id;

    const result = await Series.findByIdAndDelete(id);
    if (result) {
      res.send("Successfully deleted");
    } else {
      res.status(404).send("Can't find Series");
    }
  }

  // Edit series
  async editAnSeries(req, res) {
    var data = req.body;
    const id = req.params.id;
    const { error } = seriesVerify(data);

    if (error) return res.send("Erorr!!");
    const series = await Series.findById(id);
    if (!series) res.send("Not Found");
    const UpdateSeries = await Series.findByIdAndUpdate(
      id,
      {
        $set: {  ...data },
      },
      { new: true }
    );

    if (UpdateSeries) {
      res.send(UpdateSeries);
    } else {
      res.send("Can't update series");
    }
  }

  // // get all the series according to the budget
  // async GetAllSeriesByBuget(req,res){
  //   const data = req.body.Budget;
  //   const series = await Series.find().sort(`-${data}`)
  //   res.send(series);
  // }

  // // get all the series according to the Popularity
  // async GetAllSeriesByPopularity(req,res){
  //   const data = req.body.Popularity;
  //   const series = await Series.find().sort(`-${data}`)
  //   res.send(series);
  // }

  // // get all the series according to the Revenue
  // async GetAllSeriesByRevenue(req,res){
  //   const data = req.body.Revenue;
  //   const series = await Series.find().sort(`-${data}`)
  //   res.send(series);
  // }

  // find and sorting series data
  async findSeriesAndSort(req, res) {
    const queryperam = req.query.filter;
    const Ascending = req.query.ascending;

    const series = await Series.find()
      .populate("spoken_languages")
      .populate("genres")
      .populate("compaines")
      .populate("seasons")
      .sort(queryperam);

    if (!series) return res.status(404).send({ msg: `Series not found` });

    if (Ascending == "descending")
      return res.status(200).send(series.reverse());

    return res.status(200).send(series);
  }

  // search series and filter results
  async findSeriesBySearch(req, res) {
    const queryperam = req.query.item1;
    const queryName = req.query.item;

    const seriesData = await Series.find({ [queryperam]: queryName })
      .populate("spoken_languages")
      .populate("genres")
      .populate("compaines")
      .populate("seasons")
      .sort(`${queryperam}`);

    if (seriesData.length <= 0)
      res.status(500).send({ msg: `Series not found` });

    return res.status(200).send(seriesData);
  }
}

module.exports = SeriesDomain;
