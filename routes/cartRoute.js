const express = require("express");
const cartRoute = express();
const bodyParser = require("body-parser");


cartRoute.use(bodyParser.json());
cartRoute.use(bodyParser.urlencoded({extended:true}));

//middlware
const auth = require("../middlware/auth");

//routes
const cartContoller = require("../controllers/cartController")

cartRoute.post("/Add-to-Cart",auth,cartContoller);

module.exports = cartRoute

