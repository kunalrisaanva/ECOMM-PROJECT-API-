const express = require("express");
const user_route = express();
const bodyParser = require("body-parser");

user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}))

const multer = require("multer");
const path  = require("path");

user_route.use(express.static('public'));

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,"../public/userImages")),function(err,success){
          if(err) throw err  
        }
    },

    filename:function(req,file,cb){
      const name = Date.now()+"-"+file.originalname
      cb(null,name,function(error1,success1){
        if(error1) throw error1
      })
    }
    
})

const upload = multer({storage:storage});

const user_controller = require("../controllers/userController");

const auth = require("../middlware/auth");

user_route.post('/register',upload.single('image'),user_controller.registerUser);

user_route.post('/login',user_controller.user_login);


// protected routes

// auth route 

user_route.get('/test',auth,function(req,res){

   res.status(200).send({success:true,msg:"authenticated"});

});


// upadate password route 

user_route.post("/updatePassword",auth,user_controller.updatePassword);

user_route.post("/forgotPassword",user_controller.forgotPassword);

user_route.get("/resetPassword",user_controller.resetPassword);

user_route.post("/refresh-token",auth,user_controller.refresh_token);

module.exports = user_route  