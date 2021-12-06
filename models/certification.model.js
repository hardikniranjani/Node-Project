const mongoose = require('mongoose');

const mongoDB = "mongodb://localhost/backend";

mongoose
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"));

const certificaionSchema  = new mongoose.Schema({
    tvCertificates : {
        type : Object
    },
    movieCertificates : {
        type : Object
    }
})