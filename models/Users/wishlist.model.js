const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    User: {
        type: Number,
        ref: 'users'
    },
    Movies: {
        type: [Number],
        ref: 'movies'
    },
    Series:{
        type: [Number],
        ref: 'series'
    },
    Season:{
        type: [Number],
        ref: 'seasons'
    },
    Episode:{
        type: [Number],
        ref: 'episode'
    }
})

const wishlistItems = mongoose.model('wishlist',wishlistSchema);

module.exports = wishlistItems;