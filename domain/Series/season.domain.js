const Series = require("../../models/Series/series.model");
const season = require("../../models/Series/season.model");

class seasonDomain {
  // create new season

  async createAnseason(req, res) {
    var data = req.body;
    var id = req.params.series_id;
    const result = await Series.findById(id);

    if (!result) {
      res.status(404).send({ msg: `${id} not found` });
      return;
    }

    const Season = new season({
      _id: data._id,
      SeasonName: data.SeasonName,
      SeasonNumber: data.SeasonNumber,
      SeriesID: data.SeriesID,
      ShortDescription: data.ShortDescription,
      Number_of_episodes: data.Number_of_episodes,
      Vote_average: data.Vote_average,
      Vote_count: data.Vote_count,
      Poster_path: data.Poster_path,
      Episodes: data.Episodes,
      IsActive: data.IsActive,
    });
    const UpdateSeries = await Series.findByIdAndUpdate(
      id,
      {
        $addToSet: {
          Seasons: data._id,
        },
      },
      { new: true }
    );

    const newseason = await Season.save();
    if (newseason) {
      res.send({
        season: newseason,
        serires: {
          series_id: UpdateSeries._id,
          series_name: UpdateSeries.SeriesName,
          seasons: UpdateSeries["Seasons"],
        },
      });
      // res.send(UpdateSeries);
    } else {
      res.send("can't create new season");
    }
  }

  // get all season
  async getAllseason(req, res) {
    var id = req.params.series_id;
    const result = await Series.findById(id);

    if (!result)
      return res.status(404).send({ msg: `Can't found series = ${id}` });

    // finding season with given seriesId   
    const findSeason = await season.find({ SeriesID: id });

    if (!findSeason) return res.status(404).send({ msg: "Not able to find." });

    res.status(200).send({ seasons: findSeason });
  }

  // get season by id

  async getAnseason(req, res) {
    var SeriesID = req.params.series_id;
    var seasonID = req.params.season_id;

    const season_result = await season.findOne({ SeriesID ,_id : seasonID }).populate("Episodes");

    if (!season_result || !season_result.IsActive)
      return res.status(404).json({ msg: `Season id ${seasonID} not found` });

    res.status(200).send({ seasons: season_result });
  }

  // delete season by id

  async deleteAnseason(req, res) {
    var seriesID = req.params.series_id;
    var seasonID = req.params.season_id;
    const series_result = await Series.findById(seriesID);

    const season_result = await season.findById(seasonID);

    if (series_result) {
      if (season_result) {
        const UpdateSeries = await Series.findOneAndUpdate(
          { _id: seriesID },
          {
            $pull: {
              season: seasonID,
            },
          },
          { new: true }
        );

        console.log(UpdateSeries);
        res.send("Successfully deleted");
        // res.send(UpdateSeries);
      } else {
        res.send("season not found");
      }
    } else {
      res.send("series not found");
    }
  }

  //   Edit season
  async editAnseason(req, res) {
    var data = req.body;
    var seriesID = req.params.series_id;
    var SeasonNumber = req.query.SeasonNumber;
    const series_result = await Series.findById(seriesID);
    const season_result = await season.find({ SeasonNumber });

    if (!series_result)
      return res.status(404).json({ msg: `Series id ${seiresID} not found` });

    if (!season_result)
      return res.status(404).json({ msg: `Season id ${seasonID} not found` });

    const updateseason = await season.findOneAndUpdate(
      SeasonNumber,
      {
        $set: { ...data },
      },
      { new: true }
    );

    if(!updateseason) return res.status(500).send({msg : `Can't update season with id ${seasonID}`})

    res.status(200).send(updateseason);

  }

  // get episode from season
  async getEpisodesOfSeason(req, res) {
      const SeasonId = Number(req.query.SeasonId);

      console.log(SeasonId,"line 155 season.domain");
      
      const findSeason = await season.findById(SeasonId).populate("Episodes");

      console.log(findSeason);

      if (!findSeason)
        return res
          .status(404)
          .json({ msg: `Season Number ${SeasonId} not found` });
      
      res.status(200).send(findSeason);
  }
}

module.exports = seasonDomain;

// _id: data._id,
// SeasonName: data.SeasonName,
// SeasonNumber: data.SeasonNumber,
// SeriesNumber: data.SeriesNumber,
// ShortDescription: data.ShortDescription,
// Number_of_episodes: data.Number_of_episodes,
// Vote_average: data.Vote_average,
// Vote_count: data.Vote_count,
// Poster_path: data.Poster_path,
// Episodes: data.Episodes,
// IsActive: data.IsActive,
