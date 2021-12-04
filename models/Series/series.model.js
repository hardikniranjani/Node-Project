const mongoose = require('mongoose');
const Joi = require('joi');

var mongoDB = "mongodb://localhost/backend"
mongoose.connect(mongoDB, {useNewUrlParser:true, useUnifiedTopology:true})

const seriesSchema = new mongoose.Schema(({
    _id:{
        type:Number
    },
    SeriesName:{
        type:String,
    },
    ShortDescription:{
        type:String
    },
    Category:{
        type:[Number],
        ref:'Categories'
},

    ReleaseDate:{
        type:Date
    },
    Rating:{
        type:Number
    },
    DirectorName:{
        type:String
    },
    LongDescription:{
        type:String
    },
    Session:{
        type:[Number],
        ref:'Session'
    }
}))

const Series= mongoose.model('series',seriesSchema);



module.exports =Series ;