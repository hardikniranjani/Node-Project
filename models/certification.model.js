const mongoose = require('mongoose');

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