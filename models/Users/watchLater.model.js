const mongoose = require('mongoose');

const watchLaterSchema = new mongoose.Schema({
    User: {
        type: Number,
        ref: 'users'
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

const watchLater = mongoose.model('watchLater',watchLaterSchema);

module.exports = watchLater;