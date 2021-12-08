import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    _id : {
        type : Number,
        required : true
    },
    Monthly_price : {
        type : Number,
        required : true
    },
    
    Plan_name : {
        type : String,
        required : true
    },
    Number_of_screen_available : {
        type : Number,
        required : true
    },
    Max_video_quality : {
        type : String,
        required : true,
    },
    IsActive : {
        type : Boolean,
        required : true
    },
    Devices : {
        type : [],
        required : true
    },
    offer : {

    }   
    
});

const SubscriptionModel = mongoose.model('Subscription',subscriptionSchema);

module.exports = { SubscriptionModel };