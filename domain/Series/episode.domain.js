const season_Model = require("../../models/Series/season.model");
const series_Model = require("../../models/Series/season.model");
const episode_Model = require("../../models/Series/episode.model");
class episodeDomain {
  //   create episode
  async createAnEpisode(req, res) {
    if (req.user !== "admin")
      res.status(401).send({ msg: "You are not authorized!!!" });

    const data = req.body;
    const season_id = req.params.season_id;
    const series_id = req.params.series_id;

    const findSeasonId = await season_Model.findById(season_id);
    const findSeriesId = await series_Model.findById(series_id);

    if (!findSeriesId)
      return res
        .status(404)
        .send({ msg: `Series id ${series_id} not found!!!` });

    if (!findSeasonId)
      return res
        .status(404)
        .send({ msg: `Season id ${season_id} not found!!!` });

    const dateParts = data.ReleaseDate.split("-");
    const year = dateParts[2];
    const month = dateParts[1];
    const day = dateParts[0];
    const date = new Date(year, month, day);

    const allEpisode = await episode_Model.find().sort({ _id: -1 });

    let id = 1;
    if (allEpisode.length !== 0) {
      console.log(allEpisode, "line 33 episode.domain");
      id = allEpisode[0]._id + 1;
    }

    const newEpisode = new episode_Model({
      _id: id,
      EpisodeName: data.EpisodeName,
      EpisodeNumber: data.EpisodeNumber,
      ShortDescription: data.ShortDescription,
      Series_Number: data.Series_Number,
      Season_Number: data.Season_Number,
      ReleaseDate: date,
      Poster_path: data.Poster_path,
      Video_path: data.Video_path,
      Vote_average: data.Vote_average,
      Vote_count: data.Vote_count,
    });

    try {
      const result = await newEpisode.save();
      res.status(200).send(result);
    } catch (e) {
      res.status(500).send({ msg: "Server Error!!" });
    }
  }

  //   write bulk episodes
  async createBulkEpisode(req, res) {
    if (req.user !== "admin")
      res.status(401).send({ msg: "You are not authorized!!!" });

    const arrayOfEpisode = req.body;

    episode_Mode.insertMany(arrayOfEpisode, (err, docs) => {
      if (err) return res.status(400).send("error while inserting the data");
      res.status(200).send(docs);
    });
  }

  async getAnEpisode(req, res) {
    const season_id = req.params.season_id;
    const series_id = req.params.series_id;

    const findEpisode = await episode_Model.find({
      Series_Number: series_id,
      Season_Number: season_id,
    });

    if (!findEpisode) res.status(404).send({ msg: "data not found" });
  }
}
module.exports = episodeDomain;
