const mongoose = require('mongoose');

var mongoDB = "mongodb://localhost/backend"
mongoose.connect(mongoDB,{useNewUrlParser:true, useUnifiedTopology:true})


const episodeSchema = new mongoose.Schema(({
    _id:{
        type:Number,
    },
    EpisodeName:{
        type:String,
    },
    EpisodeNumber:{
        type:Number,
        min:1
    }
}))

const Episode = new mongoose.model('Episode',episodeSchema);

module.exports = Episode;