const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    UserId: {
        type: Number,
        ref: 'users'
    },
    Movies: {
        type: [Number],
        ref: 'Movies'
    },
    Series:{
        type: [Number],
        ref: 'series'
    }
})

const wishlistItems = mongoose.model('wishlist',wishlistSchema);

module.exports = wishlistItems;