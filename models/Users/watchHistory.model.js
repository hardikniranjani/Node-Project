const mongoose = require('mongoose');

const watchHistorySchema = new mongoose.Schema({
    User: {
        type: Number,
        ref : 'users'
    },
    Movies: {
        type: [Number],
        ref: 'Movies'
    }, 
    Episode:{
        type: [Number],
        ref: 'episode'
    },
    IsActive: {
        type: Boolean,
        default: true,
      },
})

const watchHistory = mongoose.model('watchHistory',watchHistorySchema);

module.exports = watchHistory;