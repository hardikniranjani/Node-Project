const UserModel = require('../models/Users/user.model');
const watchHistory = require('../models/Users/watchHistory.model');
const watchLater = require('../models/Users/watchLater.model');
const wishlist = require('../models/Users/wishlist.model');


class UserDomain {
    async createAnUser(req,res){
        const user = req.User;
        const { error } = UserModel.userValidation(user);
        
    }
}

module.exports = User;