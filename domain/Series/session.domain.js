const Series = require("../../models/Series/series.model");
const Session = require("../../models/Series/Session.model");

class SessionDomain {

  // create new Session

  async createAnSession(req, res) {
    var data = req.body;
    var id = req.params.series_id;
    const result = await Series.findById(id);


    if (result) {
      let session = new Session({
        _id: data._id,
        SessionName: data.SessionName,
        SessionNumber: data.SessionNumber,
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
          Session:data._id
        },
      }, {new:true})

      const newSession = await session.save();
      if (newSession) {
        res.send(newSession);
        res.send(UpdateSeries);
      } else {
        res.send("can't create new session");
      }
    } else {
      res.send("series not found");
    }
  }

  // get all session
  async getAllSession(req, res) {
  
    var id = req.params.series_id;
    const result = await Series.findById(id);
    console.log(result);
 
    var session_arry = [];
    for(let i = 0; i < result.Session.length; i++) {
      session_arry.push( await Session.findById(result.Session[i]))
    }
    
  res.send(session_arry);
    console.log(id)

   }
   

  // get session by id

  async getAnSession(req, res) {
    var seriesID = req.params.series_id;
    var sessionID = req.params.session_id;
    const series_result = await Series.findById(seriesID);
    const session_result = await Session.findById(sessionID);

    if (series_result) {
      if (session_result) {
        res.send(session_result);
      } else {
        res.send("session not found");
      }
    } else {
      res.send("series not found");
    }
  }

  // delete session by id

  async deleteAnSession(req, res) {
    var seriesID = req.params.series_id;
    var sessionID = req.params.session_id;
    const series_result = await Series.findById(seriesID);
    const session_result = await Session.findById(sessionID);

    if (series_result) {
      if (session_result) {
        const UpdateSeries =await Series.findOneAndUpdate({ _id: seriesID}, {
          $pull: {
            Session: sessionID 
          },
        }, {new:true})

        console.log(UpdateSeries)
        res.send("Successfully deleted");
        // res.send(UpdateSeries);
      } else {
        res.send("session not found");
      }
    } else {
      res.send("series not found");
    }
  }

  //   Edit session

  async editAnSession(req, res) {
    var data = req.body;
    var seriesID = req.params.series_id;
    var sessionID = req.params.session_id;
    const series_result = await Series.findById(seriesID);
    const session_result = await Session.findById(sessionID);

    if (series_result) {
      if (session_result) {
        const updateSession = await Session.findByIdAndUpdate(
          sessionID,
          {
            $set: {
                _id: data._id,
                SessionName: data.SessionName,
                SessionNumber: data.SessionNumber,
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

        if (updateSession) {
          res.send(updateSession);
        } else {
          res.send("Can't update session");
        }
      } else {
        res.send("session not found");
      }
    } else {
      res.send("series not found");
    }
  }
}


module.exports = SessionDomain; 