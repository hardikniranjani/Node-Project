const mongoose = require('mongoose');



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