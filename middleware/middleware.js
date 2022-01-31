function checkRole(req,res,next){
      // console.log(req.user.role.toString());
      if(req.user.role.toString() == 'admin') return next();
      res.status(401).send({ msg: "You are not authorized!!!" });
}

module.exports = checkRole;