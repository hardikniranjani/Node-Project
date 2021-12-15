const movieCertificaion = require("../models/Certification/movieCertification.model");
const tvCertificaion = require("../models/Certification/tvCertification.model");

class CertificationDomain {
  
  
    async createMovieCertificate(req, res) {

      const data = req.body;
      const movieCertificate = new movieCertificaion({
            _id: data._id,
            Country_id: data.Country_id,
            Certification: data.Certification,
            Meaning: data.Meaning,
            Order: data.Order,
      });

      try {
            
            const result = await movieCertificate.save();
            if (result)  res.status(200).send(result);
            else res.status(400).send("Not able to save this certificate");

      } catch (e) {
            res.status(500).send(`some error ${e}`);
      }
    }

  async getMovieCerificate(req,res){
      const country_id = req.query.country_id;
      const movieCertificate = movieCertificaion.findOne({
        Country_id: country_id,
      });

      if(movieCertificate) res.status(200).send({"certificates" : movieCertificate});
      else res.status(404).send({"msg" : "No data found with this country."});
  }






  async createTvCertificate(req, res) {
    const data = req.body;
    const tvCertificate = new tvCertificaion({
      _id: data._id,
      Country_id: data.Country_id,
      Certification: data.Certification,
      Meaning: data.Meaning,
      Order: data.Order,
    });

    try {
      const result = await tvCertificate.save();
      if (result) {
        res.status(200).send(result);
      } else {
        res.status(400).send("Not able to save this certificate");
      }
    } catch (e) {
      res.status(500).send(`some error ${e}`);
    }
  }
}

module.exports = CertificationDomain;