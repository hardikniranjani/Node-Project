const season_Model = require("../../models/Series/season.model");
const series_Model = require("../../models/Series/season.model");
const episode_Model = require("../../models/Series/episode.model");

class episodeDomain {
  //   create episode
  async createAnEpisode(req, res) {
    // if (req.user !== "admin")
    //   res.status(401).send({ msg: "You are not authorized!!!" });

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

  //   write bulk episodes
  async createBulkEpisode(req, res) {
    if (req.user !== "admin")
      res.status(401).send({ msg: "You are not authorized!!!" });

    const season_id = req.params.season_id;
    const arrayOfEpisode = req.body;

    const season = await season_Model.find({_id: season_id});

    if(!season) return res.status(404).send(`Season of id ${season_id} not found`);

    episode_Model.insertMany(arrayOfEpisode, (err, docs) => {
      if (err) return res.status(400).send("error while inserting the data");
      res.status(200).send(docs);
    });

    for (let i = 0; i < arrayOfEpisode.length; i++) {
      await season_Model.findByIdAndUpdate(
        { _id: season_id },{
          $addToSet: {
            Episodes: arrayOfEpisode[i]._id
          }
        },{new:true})
    }

    res.status(200).send("Insert successfully")
  }

  //   get an episodes
  async getAnEpisode(req, res) {
    const season_id = req.params.season_id;
    const series_id = req.params.series_id;

    const findEpisode = await episode_Model.find({
      SeriesID: series_id,
      SeasonID: season_id,
    });

    if (!findEpisode) res.status(404).send({ msg: "data not found" });

    res.status(200).send(findEpisode);
  }

  // soft delete episode
  async deleteBulkEpisode(req, res) {
    if (req.user !== "admin")
      res.status(401).send({ msg: "You are not authorized!!!" });

    const season_id = req.params.season_id;
    const arrayOfEpisode = req.body;

    const season = await season_Model.find({_id: season_id});

    if(!season) return res.status(404).send(`Season of id ${season_id} not found`);

    for (let i = 0; i < arrayOfEpisode.length; i++) {
      await episode_Model.findByIdAndUpdate(
        { _id: arrayOfEpisode[i] },
        {
          $set: {
            IsActive: false,
          },
        },{new:true}
      );

      await season_Model.findByIdAndUpdate(
        { _id: season_id },
        {
          $pull: {
            Episodes: arrayOfEpisode[i]._id,
          },
        },{new:true}
      );
    }

    res.status(200).send("delete successfully")

  }

    // Hard delete episode
    async hardDeleteBulkEpisode(req, res) {
      if (req.user !== "admin")
        res.status(401).send({ msg: "You are not authorized!!!" });
  
      const season_id = req.params.season_id;
      const arrayOfEpisode = req.body;
  
      const season = await season_Model.find({_id: season_id});
  
      if(!season) return res.status(404).send(`Season of id ${season_id} not found`);
  
      for (let i = 0; i < arrayOfEpisode.length; i++) {
        await episode_Model.findByIdAndDelete(
          { _id: arrayOfEpisode[i]}
        );
  
        await season_Model.findByIdAndUpdate(
          { _id: season_id },
          {
            $pull: {
              Episodes: arrayOfEpisode[i]._id,
            },
          },{new:true}
        );
      }
  
      res.status(200).send("Hard delete successfully")
  
    }

    //update episode

    async updateAnEpisode(req, res) {
        const episode_data = req.body;
        const season_id = req.params.season_id;
        const series_id = req.params.series_id;

        const series = await episode_Model.find({SeriesID: series_id});
        if(!series) return res.status(404).send(`Series of id ${series_id} not found`);
    
        const season = await episode_Model.find({SeasonID: season_id});
        if(!season) return res.status(404).send(`Season of id ${season_id} not found`);
    
        const UpdatedEpisode = await episode_Model.findByIdAndUpdate({
          SeriesID: series_id,
          SeasonID: season_id,
        },{
          $set:{
            ...episode_data
          }
        },{new:true})

          res.status(200).send(UpdatedEpisode)
}

 //bulk update episode
 async updateAnEpisode(req, res) {
  const arrayOfEpisode = req.body;
  const season_id = req.params.season_id;
  const series_id = req.params.series_id;

  const series = await episode_Model.find({SeriesID: series_id});
  if(!series) return res.status(404).send(`Series of id ${series_id} not found`);

  const season = await episode_Model.find({SeasonID: season_id});
  if(!season) return res.status(404).send(`Season of id ${season_id} not found`);

  for (let i = 0; i < arrayOfEpisode.length; i++) {
  await episode_Model.findByIdAndUpdate({
    SeriesID: series_id,
    SeasonID: season_id,
  },{
    $set:{
      ...arrayOfEpisode
    }
  },{new:true})}

    res.status(200).send("update successfully")
}
}
module.exports = episodeDomain;
