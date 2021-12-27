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

// GenresSchema.pre('deleteMany',(next)=>{
//     let genre = this;
//     console.log(genre);
//     console.log(this)
//     genre.model("Movies").deleteOne({
//       $pull: {
//         Genres: genre._id,
//       },
//       next
//     });

// })


const genres = mongoose.model('genres', GenresSchema);

module.exports = genres;