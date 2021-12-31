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
    } else {
      res.send("can't create new season");
    }
  }

  // get all season
  async getAllseason(req, res) {
    var id = req.params.series_id;

    const findSeason = await season.find({ SeriesID: id });

    if (!findSeason) return res.status(404).send({ msg: "Not able to find." });

    res.status(200).send({ seasons: findSeason });
  }

  // get season by id

  async getAnseason(req, res) {
    var SeriesID = req.params.series_id;
    var seasonID = req.params.season_id;

    const season_result = await season
      .findOne({ SeriesID, _id: seasonID })
      .populate("Episodes");

    if (!season_result || !season_result.IsActive)
      return res.status(404).json({ msg: `Season id ${seasonID} not found` });

    res.status(200).send({ seasons: season_result });
  }

  // delete season by id

  async deleteAnseason(req, res) {
    var seriesID = req.params.series_id;
    var seasonID = req.params.season_id;

    const series_result = await season.findById({seriesID});
    if (!series_result) return res.status(404).json({ msg: `Series Not found` });
    
    const season_result = await season.findOne({seriesID,_id: seasonID});
    if (!season_result) return res.status(404).json({ msg: `Session Not found` });

       await season.findOneAndUpdate({_id: seasonID},
        {
          $set:{
            IsActive: false,
          }
        });
         await Series.findOneAndUpdate(
          { _id: seriesID },
          {
            $pull: {
              season: seasonID,
            },
          },
          { new: true }
        );

        
        res.status(200).send("Successfully deleted");

       
      
    
  }

  //   Edit season
  async editAnseason(req, res) {
    var data = req.body;
    var seriesID = req.params.series_id;
    var SeasonNumber = req.query.SeasonNumber;
    const series_result = await season.findbyOne({seriesID});
    const season_result = await season.find({ SeasonNumber });

    if (!series_result)
      return res.status(404).json({ msg: `Series id ${seriesID} not found` });

    if (!season_result)
      return res.status(404).json({ msg: `Season id ${seriesID} not found` });

    const updateseason = await season.findOneAndUpdate(
      SeasonNumber,
      {
        $set: { ...data },
      },
      { new: true }
    );

    if (!updateseason)
      return res
        .status(500)
        .send({ msg: `Can't update season with id ${SeasonNumber}` });

    res.status(200).send(updateseason);
  }

  // get all episode from season
  async getAllEpisodesOfSeason(req, res) {
    const SeasonId = Number(req.query.SeasonId);

    const findSeason = await season.findById(SeasonId).populate("Episodes");

    if (!findSeason)
      return res
        .status(404)
        .json({ msg: `Season Number ${SeasonId} not found` });

    res.status(200).send(findSeason);
  }

  // get specific episode from season
  async getAnEpisodeOfSeason(req, res){
    const SeasonId = Number(req.query.SeasonId);
    const EpisodeId = Number(req.query.EpisodeId);

    const findSeason = await season.findById(SeasonId).populate("Episodes");

    if (!findSeason) return res.status(404).json({ msg: `Season Number ${SeasonId} not found` });

    const findEpisode = findSeason.find({Episodes:{_id :EpisodeId}});

    if (!findEpisode) return res.status(404).json({ msg: `Episode Number ${EpisodeId} not found` });

    res.status(200).send(findEpisode);
  }

    // find and filter seasion data
    async findSeasionAndSort(req, res) {
      const series_id = req.query.series_id;
      const queryperam = req.query.filter;
      const Ascending = req.query.ascending;
  
      const seasion = await season
        .find({ SeriesID: series_id})
        .populate("series")
        .populate("episode")
        .sort(queryperam);
  
      if (!seasion) return res.status(404).send({ msg: `seasion not found` });
  
      if (Ascending == "descending")
        return res.status(200).send(seasion.reverse());
  
      return res.status(200).send(seasion);
    }
  
    // search seasion
    async findseasionBySearch(req, res) {
      const series_id = req.query.series_id;
      const queryperam = req.query.item1;
      const queryName = req.query.item;
  
      const seasionData = await season
        .find({
          SeriesID: series_id,
          [queryperam]: queryName,
        })
        .populate("series")
        .populate("seasons")
        .sort(`${queryperam}`);
  
      if (seasionData.length <= 0)
        res.status(500).send({ msg: `seasion not found` });
  
      return res.status(200).send(seasionData);
    }
}

module.exports = seasonDomain;


