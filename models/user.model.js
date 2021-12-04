const mongoose = require('mongoose');
const Joi = require('joi');
var mongoDB = "mongodb://localhost/backend"
mongoose.connect(mongoDB, {useNewUrlParser:true, useUnifiedTopology:true})
        .then(()=> console.log('Connected to MongoDB'));

const userSchema = new mongoose.Schema(({
    _id:{
        type:Number
    },
    Name:{
        type:String
    },
    UserName:{
        type:String
    },
    Email:{
        type:String,
        lowercase:true
    },
    Password:{
        type:String
    },
    Status:{
        type:String
    }
}))

const Users = mongoose.model('users',userSchema);
 
function userValidation(){
    const schema = Joi.object({
        _id:Joi.number(),
        Name:Joi.string().max(25),
        UserName:Joi.string().max(17),
        Email:Joi.string().email(),
        Password:Joi.string().max(20),
        Status:Joi.string().required()
    })
    
    return schema.validate()

}

module.exports = {Users, userValidation}