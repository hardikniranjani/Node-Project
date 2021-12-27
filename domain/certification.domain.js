const movieCertificaion = require("../models/Certification/movieCertification.model");
const TvCertificaion = require("../models/Certification/tvCertification.model");

class CertificationDomain {

  // ++++++ For Movies +++++++ //

  // create movie certificate
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
      if (result) res.status(200).send(result);
      else res.status(400).send("Not able to save this certificate");
    } catch (e) {
      res.status(500).send(`some error ${e}`);
    }
  }

  // get all movie certificate by country id
  async getMovieCerificate(req, res) {
    const country_id = req.query.country_id;
    const movieCertificate = movieCertificaion.findOne({
      Country_id: country_id,
    });

    if (movieCertificate)
      res.status(200).send({ certificates: movieCertificate });
    else res.status(404).send({ msg: "No data found with this country." });
  }

  // update movie certificate
  async updateMovieCertificate(req, res) {
    const movieCId = req.query.movie_certi_id;
    const data = req.body;
    const movieCertificate = await movieCertificaion.findByIdAndUpdate(
      { movieCId},
      { $set: { ...data } },
      { new: true }
    );

    try {
      if (movieCertificate) res.status(200).send(movieCertificate);
      else res.status(400).send("Not able to update this certificate");
    } catch (e) {
      res.status(500).send(`some error ${e}`);
    }
  }

  // soft delete movie certificate
  async softDeleteMovieCertificate(req, res) {
    const movieCId = req.params.movie_certi_id;
    const data = req.body;
    const movieCertificate = await movieCertificaion.findByIdAndUpdate(
      { movieCId },
      { $set: { IsActive: false } },
      { new: true }
    );

    try {
      if (movieCertificate) res.status(200).send("Soft delete successfully");
      else res.status(400).send("Not able to delete this certificate");
    } catch (e) {
      res.status(500).send(`some error ${e}`);
    }
  }

  // Hard delete movie certificate
  async hardDeleteMovieCertificate(req, res) {
    const movieCId = req.params.movie_certi_id;
    const data = req.body;
    const movieCertificate = await movieCertificaion.findByIdAndDelete({
      movieCId
    });

    try {
      if (movieCertificate) res.status(200).send("Hard delete successfully");
      else res.status(400).send("Not able to delete this certificate");
    } catch (e) {
      res.status(500).send(`some error ${e}`);
    }
  }


   // ++++++ For Tv(Series) +++++++ //

  // create Tv certificate
  async createTvCertificate(req, res) {
    const data = req.body;
    const tvCertificate = new TvCertificaion({
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

  // get all Tv certificate by country id
  async getTvCerificate(req, res) {
    const country_id = req.query.country_id;
    const TvCertificate = TvCertificaion.findOne({
      Country_id: country_id,
    });

    if (TvCertificate) res.status(200).send({ certificates: TvCertificate });
    else res.status(404).send({ msg: "No data found with this country." });
  }

  // update Tv certificate
  async updateTvCertificate(req, res) {
    const TvCId = req.query.tv_certi_id;
    const data = req.body;
    const TvCertificate = await TvCertificaion.findByIdAndUpdate(
      { TvCId },
      { $set: { ...data } },
      { new: true }
    );

    try {
      if (TvCertificate) res.status(200).send(TvCertificate);
      else res.status(400).send("Not able to update this certificate");
    } catch (e) {
      res.status(500).send(`some error ${e}`);
    }
  }

  // soft delete Tv certificate
  async softDeleteTvCertificate(req, res) {
    const TvCId = req.params.tv_certi_id;
    const data = req.body;
    const TvCertificate = await TvCertificaion.findByIdAndUpdate(
      { TvCId},
      { $set: { IsActive: false } },
      { new: true }
    );

    try {
      if (TvCertificate) res.status(200).send("Soft delete successfully");
      else res.status(400).send("Not able to delete this certificate");
    } catch (e) {
      res.status(500).send(`some error ${e}`);
    }
  }

  // Hard delete Tv certificate
  async hardDeleteTvCertificate(req, res) {
    const TvCId = req.params.tv_certi_id;
    const data = req.body;
    const TvCertificate = await TvCertificaion.findByIdAndDelete({
      TvCId
    });

    try {
      if (TvCertificate) res.status(200).send("Hard delete successfully");
      else res.status(400).send("Not able to delete this certificate");
    } catch (e) {
      res.status(500).send(`some error ${e}`);
    }
  }
}

module.exports = CertificationDomain;
