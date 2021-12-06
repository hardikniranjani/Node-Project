const mongoose = require('mongoose');

const mongoDB = "mongodb://localhost/backend";

mongoose
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"));

const certificaionSchema  = new mongoose.Schema({
    TvCertificates : {
        type : Object
    },
    MovieCertificates : {
        type : Object
    }
});

const certification = mongoose.model("Certification",certificaionSchema);

module.exports = certification;