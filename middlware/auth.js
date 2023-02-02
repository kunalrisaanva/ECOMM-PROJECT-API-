const jwt = require("jsonwebtoken");
const config = require("../config/config");


const verifyToken = async(req,res,next) => {
     try {
    const token = req.body.token || req.query.token || req.headers["authorization"];
    if(!token){
        res.status(200).send({success:false,msg:"token is required for authrization..."});
    }else{
        const decode  =  jwt.verify(token,config.secret_jwt);
        req.user = decode;
        return next();
    }
   } catch (error) {
    res.status(401).send("invalid token");
   }
}; 



module.exports = verifyToken
