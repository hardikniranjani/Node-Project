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
    Name : {
        type: String,
        required : true,
    },
    Origin_country : {
        type: String,
        required : true
    },
    Headquaters : {
        type : String
    },
    Description : {
        type :String
    }
});


const company = mongoose.model("Companies",companySchema);

module.exports = company;