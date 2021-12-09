const mongoose = require('mongoose');

const watchHistorySchema = new mongoose.Schema({
    User: {
        type: Number,
        ref : 'users'
    },
    Movies: {
        type: [Number],
        ref: 'movies'
    }, 
    Episode:{
        type: [Number],
        ref: 'episode'
    }
})

const watchHistory = mongoose.model('watchHistory',watchHistorySchema);

module.exports = watchHistory;