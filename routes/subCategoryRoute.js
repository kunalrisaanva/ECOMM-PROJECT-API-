const bodyParser = require("body-parser");
const express = require("express");
const subCategory_route = express();

subCategory_route.use(bodyParser.json());
subCategory_route.use(bodyParser.urlencoded({extended:true}));

//middleware
const auth = require("../middlware/auth");

const subcategoryController = require("../controllers/subCategoryController");

subCategory_route.post("/add-sub-category",auth,subcategoryController.create_subcategory);

module.exports = subCategory_route