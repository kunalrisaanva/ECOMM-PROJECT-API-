const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const config = require("../config/config");
const jwt = require("jsonwebtoken");
const nodeMailer = require("nodemailer");
const randomstring = require("randomstring");
const fs = require("fs")

const sendResetPasswordMail = async(name,email,token) => {
   try {
    const trasnsporter = await nodeMailer.createTransport({
         host:"smtp.gmail.com",
         port:587,
         secure:false,
         requireTLS:true,
         auth:{
            user:config.emailUser,
            pass:config.emailPassword
         }
       });


       const mailOptions = {
               from:config.emailUser,
               to:email,
               subject:"FOR RESET Password",
               html:'<p> Hii '+name+', Please Copy the link and <a href="http://localhost:2002/api/resetPassword?token='+token+'">and reset your password </a>'
       }
       trasnsporter.sendMail(mailOptions,function(error,infor){
        if(error){
            console.log(error)
        }else{
            console.log("Mail has been sent :-" ,infor.response)
        }
       })
   } catch (error) {
     res.status(400).send({success:"false",msg:error.message})
   }
}


const create_token = async(_id) => {
    try {
      const token =  await jwt.sign({_id:_id},config.secret_jwt,{expiresIn:"5d"});
        return token
    } catch (error) {
        res.status(400).send(error.message)   
        // console.log(error)
    }
}

const securpassword = async(password) => {
    try {
      const passwordHash = await bcrypt.hash(password,(10))
        return passwordHash
    } catch (error) {
        res.status(400).send(error.message)
    }
}

const registerUser = async(req,res) => {
    try {
        const spassword = await securpassword(req.body.password) 
      const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: spassword,
            mobile:req.body.mobile,
            image:req.file.filename,
            type:req.body.type

        })

        const userData = await User.findOne({email:req.body.email});
        if(userData){
           
            res.status(400).send({success:false,msg:"this email is already exist"});
        }else{
            const user_data =  await user.save()
            res.status(200).send({success:true,data:user_data});
        }
        
    } catch (error) {
      res.status(400).send(error.message);
    }
}



// login api

const user_login = async(req,res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        
        const userData = await User.findOne({email:email});
        if(userData){
            const passwordMatch = await bcrypt.compare(password,userData.password)
            if(passwordMatch){
                const tokenData = await create_token(userData._id)
               const user_result = {
                _id:userData._id,
                name:userData.name,
                email:userData.email,
                password:userData.password,
                image:userData.image,
                mobile:userData.mobile,
                type:userData.type,
                token:tokenData
               }

                const response = {
                    success:true,
                    msg:"user Details",
                    data:user_result
                }

                res.status(200).send(response)
            }else{
                res.status(400).send({succsess:false,msg:"password does not match"})
            }
        }else{
            res.status(400).send({succsess:false,msg:"login details are incrypt"})
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}


// updatePassword 

const updatePassword = async(req,res) => {
   try {
      const {user_id , password} = req.body
     const data = await User.findOne({_id:user_id});
     if(data){
        const newpassword = await securpassword(password)
      const userData =   User.findByIdAndUpdate({_id:user_id},{$set:{password:newpassword}});
      res.status(200).send({success:true,msg:"your password has been updated"})
     }else{
        res.status(400).send({success:false,msg:"user id not found"})
     }
   } catch (error) {
     res.send(error.message).status(400);
   }
}


// forgot password


const forgotPassword = async(req,res) => {
    try {
      const email = req.body.email
      const userData = await User.findOne({email:email})
        if(userData){
           const randomString = randomstring.generate();
            const data =  await User.updateOne({email:email},{$set:{token:randomString}});
            sendResetPasswordMail(userData.name,userData.email,randomString);
            res.send("plz check your inbox of mail and reset your password").status(200)
      }else{
        res.send({success:false,msg:"this email doest not exists"}).status(200)
      }
    } catch (error) {
        res.send({success:false,msg:error.message}).status(400)
    }
}

// reset password 

const resetPassword = async(req,res) => {
    try {
        const token = req.query.token
        const tokenData = await User.findOne({token:token});
        if(tokenData){
               const password = req.body.password;
               const newpassword = await securpassword(password);
               const userData = await User.findByIdAndUpdate({_id:tokenData._id},{$set:{password:newpassword,token:""}},{new:true});
               res.send({success:true,msg:"user password has been changed",data:userData}).status(200);
        }else{
            res.send({success:true,msg:"this link has been expired"}).status(200);
        }
    } catch (error) {
        res.send({success:false,msg:error.message}).status(401)
    }
}


// renew token 

const renew_token = async(id) => {
    try {

        const secret_jwt = config.secret_jwt;
        const newSecretJwt = randomstring.generate();

        fs.readFile("config/config.js","utf-8",function(err,data){
             if(err) throw err;

            const newValue = data.replace(new RegExp(secret_jwt,"g",newSecretJwt))

            fs.writeFile("config/config.js",newValue,'utf-8',function(err,data){
                if(err) throw err
                console.log("done");
            })
        })
 
        const token = jwt.sign({_id:id},newSecretJwt,{expiresIn:"5d"});
       return token;
    } catch (error) {
        res.send({success:false,msg:error.message}).status(400)
    }
}



const refresh_token = async(req,res) => {
    try {
        const user_id = req.body.user_id;
       const userData = await User.findById({_id:user_id});
       if(userData){
          const token_data = await renew_token(user_id)
          const response = {
            user_id:user_id,
            token:token_data,
          }
          res.send({success:true,msg:"refresh token details",data:response}).status(400)
       }else{
        res.send({success:true,msg:"user not found"}).status(200)
       }
    } catch (error) {
        res.send({success:false,msg:error.message}).status(400)
    }
}

module.exports = {
    registerUser,
    user_login,
    updatePassword,
    forgotPassword,
    resetPassword,
    refresh_token
}  