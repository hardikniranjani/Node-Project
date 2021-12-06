const mongoose = require('mongoose');


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