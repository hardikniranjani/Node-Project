const express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
// const config = require("../config/config");

class LoginController {
    
}
// router.post("/",(req, res) => {
//     var data = req.body;
//     let userdata = {
//         username: data.username,
//         password: data.password
//     };


// let token = jwt.sign(userdata, config.secretKey, {
//     algorithm:config.algorithm,
//     expiresIn:"7200m",
// }); 

// if(userdata.username == "admin" && userdata.password == "admin"){
//     res.json({
//         massage:"Login Sucessful",
//         jwtoken:token,
//     })
// }else{
//     res.send("Login Failed");
// }
// });

module.exports = router;