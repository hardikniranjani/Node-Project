const mongoose = require('mongoose');


var mongoDB = "mongodb://localhost/backend"
mongoose.connect(mongoDB, {useNewUrlParser:true, useUnifiedTopology:true})


const GenresSchema = new mongoose.Schema(({
        _id:{
            type:Number,
            
        },
        GenresName:{
            type:String,
            minlength:2,
            maxlength:30
        }
})) 


const genres = mongoose.model('genres', GenresSchema);

module.exports = genres;