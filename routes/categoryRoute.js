const express = require("express");
const category_route = express();
const bodyParser = require("body-parser");

category_route.use(bodyParser.json());
category_route.use(bodyParser.urlencoded({extended:true}))


const auth = require("../middlware/auth");
const categoryController = require("../controllers/categoryController")
category_route.post("/add_category",auth,categoryController.add_category);


module.exports = category_route
 