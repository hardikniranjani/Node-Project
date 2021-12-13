require("dotenv").config();
const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.header("x-access-token");
  if (!token)
    return res.status(401).send("Access Denied. Please Login again!!!");
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
      algorithm: 'HS256',
    });
    req.user = decoded;
    console.log("token verified!!!!!!!!");
    next();
  } catch (err) {
    console.log("err",err);
    res.status(400).send("Please login again!!!");
  }
};

module.exports =  verifyToken ;
