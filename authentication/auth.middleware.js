require("dotenv").config();
const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.header("x-access-token");
  if (!token)
    return res.status(401).send("Access Denied. Please Login again!!!");
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
      algorithm: HSA256,
    });
    req.user = decoded;
    next();
  } catch (err) {
    console.log("err");
    res.status(400).send(err);
  }
};

module.exports =  verifyToken ;
