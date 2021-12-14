const mongoose = require("mongoose");

const certificaionSchema  = new mongoose.Schema({
   
});

const certification = mongoose.model("Certification",certificaionSchema);

module.exports = certification;
