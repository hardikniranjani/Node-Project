const Series = require("../../models/Series/series.model");
const season = require("../../models/Series/season.model");

class seasonDomain {

  // create new season

  async createAnseason(req, res) {
    var data = req.body;
    var id = req.params.series_id;
    const result = await Series.findById(id);

    if (result) {
      let season = new season({
        _id: data._id,
        SeasonName: data.SeasonName,
        SeasonNumber: data.SeasonNumber,
        SeriesNumber : data.SeriesNumber,
        ShortDescription:data.ShortDescription,
        Number_of_episodes: data.Number_of_episodes,
        Vote_average: data.Vote_average,
        Vote_count: data.Vote_count,
        Poster_path: data.Poster_path,
        Episode: data.Episode,
        IsActive: data.IsActive,
      });
      const UpdateSeries = await Series.findByIdAndUpdate(id, {
        $push: {
          season:data._id
        },
      }, {new:true})

      const newseason = await season.save();
      if (newseason) {
        res.send(newseason);
        res.send(UpdateSeries);
      } else {
        res.send("can't create new season");
      }
    } else {
      res.send("series not found");
    }
  }


  
  // get all season
  async getAllseason(req, res) {
  
    var id = req.params.series_id;
    const result = await Series.find(id);

    if(!result) res.status(404).send({msg : `Can't found series = ${id}`});
    
    
    res.send(result);

  }
   

  // get season by id

  async getAnseason(req, res) {
    var seriesID = req.params.series_id;
    var seasonID = req.params.season_id;
    const series_result = await Series.findById(seriesID);
    const season_result = await season.findById(seasonID);

    if (series_result) {
      if (season_result) {
        res.send(season_result);
      } else {
        res.send("season not found");
      }
    } else {
      res.send("series not found");
    }
  }

  // delete season by id

  async deleteAnseason(req, res) {
    var seriesID = req.params.series_id;
    var seasonID = req.params.season_id;
    const series_result = await Series.findById(seriesID);
    const season_result = await season.findById(seasonID);

    if (series_result) {
      if (season_result) {
        const UpdateSeries =await Series.findOneAndUpdate({ _id: seriesID}, {
          $pull: {
            season: seasonID 
          },
        }, {new:true})

        console.log(UpdateSeries)
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
    var seasonID = req.params.season_id;
    const series_result = await Series.findById(seriesID);
    const season_result = await season.findById(seasonID);

    if (series_result) {
      if (season_result) {
        const updateseason = await season.findByIdAndUpdate(
          seasonID,
          {
            $set: {
                _id: data._id,
                SeasonName: data.SeasonName,
                SeasonNumber: data.SeasonNumber,
                SeriesNumber : data.SeriesNumber,
                ShortDescription:data.ShortDescription,
                Number_of_episodes: data.Number_of_episodes,
                Vote_average: data.Vote_average,
                Vote_count: data.Vote_count,
                Poster_path: data.Poster_path,
                Episode: data.Episode,
                IsActive: data.IsActive,
            },
          },
          { new: true }
        );

        if (updateseason) {
          res.send(updateseason);
        } else {
          res.send("Can't update season");
        }
      } else {
        res.send("season not found");
      }
    } else {
      res.send("series not found");
    }
  }
}


module.exports = seasonDomain; 