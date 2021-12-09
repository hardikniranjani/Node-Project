const express = require('express');
const UserDomain = require('../domain/user.domain');
const router = express.Router();
const verifyToken = require('../authentication/auth.middleware');


class userController{

    // get user by id 
    static async getUser(req,res){
        const userDomain = new UserDomain();
        userDomain.getAnUser(req,res);
    }

    // create User
    static async createUser(req,res){
        const userDomain = new UserDomain();
        userDomain.createAnUser(req,res);
    }

    // update user
    static async editUser(req,res){
        const userDomain = new UserDomain();
        userDomain.editAnUser(req,res);
    }

    // delete user
    static async deleteUser(req,res){
        const userDomain = new UserDomain();
        userDomain.deleteAnUser(req,res);
    }
}

// create User
router.post('/signup', userController.createUser);

router.post('/login')

// // verify uthantication
// router.use(verifytoken);

router.use(verifyToken);
// get user by id 
router.get('/:id', userController.getUser);


// update user
router.put('/:id', userController.editUser);

// delete user
router.delete('/:id', userController.deleteUser);

module.exports = router;