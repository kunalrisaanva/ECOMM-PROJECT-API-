const express = require("express");
const product_route = express();

const bodyParser = require("body-parser");

product_route.use(bodyParser.json());
product_route.use(bodyParser.urlencoded({extended:true}));


const multer = require("multer");
const path = require("path");

product_route.use(express.static("public"));

const storage = multer.diskStorage({
    destination:function(req,file,cb){
      cb(null,path.join(__dirname,"../public/productImages"),function(err,succsess){
         if(err) throw err
      })
    },

    filename:function(req,file,cb){
        const name = Date.now()+"-"+file.originalname;
        cb(null,name,function(err,succsess){
            if(err) throw err
        })
    }

    
})

const upload = multer({storage:storage});

//middleware

const auth = require("../middlware/auth");

const product_Controller = require("../controllers/productController");

product_route.post("/add-product",upload.array('images'),auth,product_Controller.add_product);
product_route.get("/Get-product",auth,product_Controller.get_product);
product_route.get("/Search-product",auth,product_Controller.search_product);
product_route.post("/Peginate",auth,product_Controller.paginate)

module.exports = product_route 