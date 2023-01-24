const bodyParser = require("body-parser");
const express =require("express");
const addressRoute = express();

addressRoute.use(bodyParser.json());
addressRoute.use(bodyParser.urlencoded({extended:true}));

//middlware
const auth = require("../middlware/auth");

const addres_Contoller = require("../controllers/addressController"); 

addressRoute.post("/Add-Adress",auth,addres_Contoller.add_address);

module.exports = addressRoute;