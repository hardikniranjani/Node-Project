const mongoose = require('mongoose');
const Joi = require('joi');


const userSchema = new mongoose.Schema({
  _id: {
    type: Number,
  },
  Name: {
    type: String
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
    default: 0,
  },
  Subscription_plan_id: {
    type: Number,
    ref: "Subscription",
    default : null
  },
  watchHistory: {
    type: Number,
    ref: "watchHistory",
  },
  IsActive: {
    type: Boolean,
    default: true,
  },
});

const UserModel = mongoose.model('users',userSchema);
 
function userValidation(){
    const schema = Joi.object({
        _id:Joi.number(),
        Name:Joi.string().max(25).required(),
        Email:Joi.string().email().required(),
        Password:Joi.string().max(25).required(),
    })
    
    return schema.validate()

}

module.exports = {UserModel, userValidation}