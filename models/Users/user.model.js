const mongoose = require('mongoose');
const Joi = require('joi');


const userSchema = new mongoose.Schema({
  _id: {
    type: Number,
  },
  Name: {
    type: String,
  },
  UserName: {
    type: String,
  },
  Email: {
    type: String,
    lowercase: true,
  },
  Password: {
    type: String,
  },
  Role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  Subscription_duration: {
    type: Number,
    default : 3
  },
  Subscription_plan_id: {
    type: Number,
    ref: "Subscription",
  },
  IsActive: {
    type: Boolean,
    default: true,
  },
});

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