const season_Model = require("../../models/Series/season.model");
const series_Model = require("../../models/Series/season.model");
const episode_Model = require("../../models/Series/episode.model");
const path = require("path");

class episodeDomain {
  //   create episode
  async   createAnEpisode(req, res) {

    const data = req.body;
    const season_id = data.SeasonID;
    const series_id = data.SeriesID;

    const findSeasonId = await season_Model.findById(season_id);

    if (!findSeasonId)
      return res
        .status(404)
        .send({ msg: `Season id ${season_id} not found!!!` });

    const findSeriesId = await series_Model.findById(series_id);

    if (!findSeriesId)
      return res
        .status(404)
        .send({ msg: `Series id ${series_id} not found!!!` });

    const findEpisode = await episode_Model.findById(data._id);

    if (findEpisode)
      return res
        .status(400)
        .send({ msg: `Episode Id ${data._id} already available ` });

    const dateParts = data["ReleaseDate"].split("-");

    const year = Number(dateParts[2]);
    const month = Number(dateParts[1]) - 1;
    const day = Number(dateParts[0]) + 1;
    const date = new Date(year, month, day);

    const allEpisode = await episode_Model.find().sort({ _id: -1 });

    let id = 1;
    if (allEpisode.length !== 0) {
      id = allEpisode[0]._id + 1;
    }

    const newEpisode = new episode_Model({
      _id: id,
      EpisodeName: data.EpisodeName,
      EpisodeNumber: data.EpisodeNumber,
      ShortDescription: data.ShortDescription,
      SeriesID: data.SeriesID,
      SeasonID: data.SeasonID,
      ReleaseDate: date,
      Poster_path: data.Poster_path,
      Video_path: data.Video_path,
      Vote_average: data.Vote_average,
      Vote_count: data.Vote_count,
    });

    try {
      const result = await newEpisode.save();
      const addToSeason = await season_Model.findByIdAndUpdate(
        season_id,
        {
          $addToSet: {
            Episodes: id,
          },
        },
        { new: true }
      );
      res.status(200).send({
        episode: result,
        season: {
          SeasonId: addToSeason._id,
          SeasonName: addToSeason.SeasonName,
          Episodes: addToSeason.Episodes,
        },
      });
    } catch (e) {
      res.status(500).send({ msg: "Server Error!!" });
    }
  }



  // uplode episode video 
  async uploadEpisode(req, res) {
    const episode_id = req.query.episode_id;
    const pathToUpload = path.normalize(`${__dirname}/../..`);
   
    const findEpisode = await episode_Model.findById(episode_id);

    if (!findEpisode)
      return res
        .status(400)
        .send({ msg: `Can't found episode with id ${episode_id}` });

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

    const vpath = `${pathToUpload}/public/Episodes/videos/${findEpisode.EpisodeName}.${videoType[1]}`;
    const bpath = `${pathToUpload}/public/Episodes/images/${findEpisode.EpisodeName}.${bannerType[1]}`;

    await video.mv(vpath, (err) => {
      if (err) return res.status(500).send({ msg: `error : ${err.message}` });
    });

    await banner.mv(bpath, (err) => {
      if (err) return res.status(500).send({ msg: `error : ${err.message}` });
    
    });

    const updatedEpisode = await episode_Model.findOneAndUpdate(
      { _id: episode_id },
      {
        $set: {
          Video_path: vpath,
          Poster_path: bpath,
        },
      },
      { new: true }
    );

    if (!updatedEpisode)
      return res.status(400).send({ msg: "not able to upload movie" });

    res.status(200).send({ Episode: updatedEpisode });
  }




  //   write bulk episodes
  async createBulkEpisode(req, res) {
    
    const season_id = req.query.season_id;
    const arrayOfEpisode = req.body;
    const dateUpdatedEpisode = arrayOfEpisode.map((obj) => {
      const oldDate = obj.ReleaseDate;
      const dateParts = oldDate.split("-");

      const year = Number(dateParts[2]);
      const month = Number(dateParts[1]) - 1;
      const day = Number(dateParts[0]) + 1;
      const date = new Date(year, month, day);

      obj.ReleaseDate = date;
      return obj;
    });

    const season = await season_Model.find({ _id: season_id });

    if (season.length <= 0)
      return res.status(404).send(`Season of id ${season_id} not found`);

    await episode_Model.insertMany(dateUpdatedEpisode);

    const updateIdsToSeason = dateUpdatedEpisode.map((obj) => obj._id);

    const updateSeason = await season_Model.findByIdAndUpdate(
      { _id: season_id },
      {
        $addToSet: {
          Episodes: [...updateIdsToSeason],
        },
      },
      { new: true }
    );

    res.status(200).send({ seasonEpisodes: updateSeason.Episodes });
  }




  //   get an episodes
  async getAnEpisode(req, res) {
    const episode_id = req.query.episode_id;

    const findEpisode = await episode_Model.find({
      _id: episode_id,
    });

    if (!findEpisode) res.status(404).send({ msg: "data not found" });

    res.status(200).send(findEpisode);
  }




  // soft delete episode
  async deleteBulkEpisode(req, res) {

    const season_id = req.query.season_id;
    const arrayOfEpisode = req.body;

    const season = await season_Model.find({ _id: season_id });

    if (!season)
      return res.status(404).send(`Season of id ${season_id} not found`);

    for (let i = 0; i < arrayOfEpisode.length; i++) {
      await episode_Model.findByIdAndUpdate(
        { _id: arrayOfEpisode[i] },
        {
          $set: {
            IsActive: false,
          },
        },
        { new: true }
      );

      await season_Model.findByIdAndUpdate(
        { _id: season_id },
        {
          $pull: {
            Episodes: arrayOfEpisode[i]._id,
          },
        },
        { new: true }
      );
    }

    res.status(200).send("delete successfully");
  }



  // Hard delete episode
  async hardDeleteBulkEpisode(req, res) {

    const season_id = req.params.season_id;
    const arrayOfEpisode = req.body;

    const season = await season_Model.find({ _id: season_id });

    if (!season)
      return res.status(404).send(`Season of id ${season_id} not found`);

    for (let i = 0; i < arrayOfEpisode.length; i++) {
      await episode_Model.findByIdAndDelete({ _id: arrayOfEpisode[i] });

      await season_Model.findByIdAndUpdate(
        { _id: season_id },
        {
          $pull: {
            Episodes: arrayOfEpisode[i]._id,
          },
        },
        { new: true }
      );
    }

    res.status(200).send("Hard delete successfully");
  }




  //update episode

  async updateAnEpisode(req, res) {
    const episode_data = req.body;
    const season_id = req.query.season_id;
    const series_id = req.query.series_id;

    const series = await episode_Model.find({ SeriesID: series_id });
    if (!series)
      return res.status(404).send(`Series of id ${series_id} not found`);

    const season = await episode_Model.find({ SeasonID: season_id });
    if (!season)
      return res.status(404).send(`Season of id ${season_id} not found`);

    const UpdatedEpisode = await episode_Model.findByIdAndUpdate(
      {
        SeriesID: series_id,
        SeasonID: season_id,
      },
      {
        $set: {
          ...episode_data,
        },
      },
      { new: true }
    );

    res.status(200).send(UpdatedEpisode);
  }



  //bulk update episode
  async updateBulkEpisode(req, res) {
    const arrayOfEpisode = req.body;
    const season_id = req.query.season_id;
    const series_id = req.query.series_id;

    const series = await episode_Model.find({ SeriesID: series_id });
    if (!series)
      return res.status(404).send(`Series of id ${series_id} not found`);

    const season = await episode_Model.find({ SeasonID: season_id });
    if (!season)
      return res.status(404).send(`Season of id ${season_id} not found`);

    for (let i = 0; i < arrayOfEpisode.length; i++) {
      await episode_Model.findByIdAndUpdate(
        {
          SeriesID: series_id,
          SeasonID: season_id,
        },
        {
          $set: {
            ...arrayOfEpisode[i],
          },
        },
        { new: true }
      );
    }

    res.status(200).send("update successfully");
  }



  // find and sorting episode data
  async findEpisodeAndSort(req, res) {
    const season_id = req.query.season_id;
    const series_id = req.query.series_id;
    const queryperam = req.query.filter;
    const Ascending = req.query.ascending;

    const episode = await episode_Model
      .find({ SeriesID: series_id, SeasonID: season_id })
      .populate("SeriesID")
      .populate("SeasonID")
      .sort(queryperam);

    if (!episode) return res.status(404).send({ msg: `episode not found` });

    if (Ascending == "descending")
      return res.status(200).send(episode.reverse());

    return res.status(200).send(episode);
  }

  // search Episode and filter results
  async findEpisodeBySearch(req, res) {
    const season_id = req.query.season_id;
    const series_id = req.query.series_id;
    const queryperam = req.query.item1;
    const queryName = req.query.item;

    const EpisodeData = await episode_Model
      .find({
        SeriesID: series_id,
        SeasonID: season_id,
        [queryperam]: queryName,
      })
      .populate("series")
      .populate("seasons")
      .sort(`${queryperam}`);

    if (EpisodeData.length <= 0)
      res.status(500).send({ msg: `Episode not found` });

    return res.status(200).send(EpisodeData);
  }
}
module.exports = episodeDomain;
