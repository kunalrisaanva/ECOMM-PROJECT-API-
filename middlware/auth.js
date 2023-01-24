const jwt = require("jsonwebtoken");
const config = require("../config/config");


const verifyToken = async(req,res,next) => {
   
    const token = req.body.token || req.query.token || req.headers["authorization"];

    if(!token){
        res.status(200).send({success:false,msg:"token is required for authrization..."})
    }

    try {

      const decode  =  jwt.verify(token,config.secret_jwt);
      req.user = decode;

    } catch (error) {
        res.status(401).send("invalid token");
    }
     return next();
}; 


module.exports = verifyToken