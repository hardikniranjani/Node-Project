const mongoose = require('mongoose');
var mongoDB = "mongodb://localhost/backend";
mongoose
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"));

const companySchema = new mongoose.Schema({
    _id: {
        type : Number,
        required : true
    },
    name : {
        type: String,
        required : true,
    },
    origin_country : {
        type: String,
        required : true
    },
    headquaters : {
        type : String
    },
    description : {
        type :String
    }
});


const company = mongoose.model("company",companySchema);

module.exports = company;