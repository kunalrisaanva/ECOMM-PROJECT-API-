const express = require("express");
const common_route = express();
const bodyParser = require("body-parser");

common_route.use(bodyParser.json());
common_route.use(bodyParser.urlencoded({extended:true}));

// middlware 
const auth = require("../middlware/auth")

const commonContoller = require("../controllers/commonController");
common_route.get("/data-count",auth,commonContoller.data_count);

module.exports = common_route