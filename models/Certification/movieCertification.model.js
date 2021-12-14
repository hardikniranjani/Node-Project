const mongoose = require("mongoose");

const movieCertificaionSchema = new mongoose.Schema({
            
});

const movieCertificaion = mongoose.model(
  "MovieCertification",
  movieCertificaionSchema
);

module.exports = movieCertificaion;
