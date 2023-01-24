const express = require("express");
const mongoose = require("mongoose");
const app = express()


//mongodb connectivity 

const mongoURL = "mongodb://localhost:27017/ECOM"

mongoose.set('strictQuery', false);

mongoose.connect(mongoURL, {useNewUrlParser: true},() => {
    console.log('db connected')
})

// user routes
const userRoute = require("./routes/userRoute");
app.use("/api",userRoute);

// store routes
const store_route = require("./routes/storeRoute");
app.use("/api",store_route)


//category routes 
const category_route = require("./routes/categoryRoute");
app.use("/api",category_route);


//subcategory routes 
const subcategory_route = require("./routes/subCategoryRoute");
app.use("/api",subcategory_route);

//product routes
const product_routes = require('./routes/productRute');
app.use("/api",product_routes)

//common route
const common_route =require("./routes/commonRoute");
app.use("/api",common_route);

//cart route
const cartRoute = require("./routes/cartRoute");
app.use("/api",cartRoute);

//adress route
const addressRoute = require("./routes/addressRoute");
app.use("/api",addressRoute);

//buyProduct route
const buy_product_route =require("./routes/buyProductRoute")
app.use("/api",buy_product_route);;

app.listen(2002,() => {
    console.log(`connected to server`)
})   