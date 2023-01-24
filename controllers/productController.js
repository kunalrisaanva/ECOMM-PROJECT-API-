const Product = require("../models/productModel");
const Category_controller = require("../controllers/categoryController")
const store_controller = require("../controllers/storeController");

const add_product = async(req,res) => {
    try {
        var arrImages = [];
        for(let i=0;i <req.files.length;i++){
            arrImages[i] = req.files[i].filename
        };
        const product = new Product({
            vendor_id:req.body.vendor_id,
            store_id:req.body.store_id,
            name:req.body.name,
            price:req.body.price,
            discount:req.body.discount,
            category_id:req.body.category_id,
            sub_cat_id:req.body.sub_cat_id,
            imaages:arrImages
        })
        const productData = await product.save();
        res.send({success:true,msg:"product details",data:productData}).status(400)
    } catch (error) {
        res.send({success:false,msg:error.message}).status(400)
    }
}


// get product methods 
 
const get_product = async(req,res) => {
    try {
            var send_data = [];
            var cat_data = await Category_controller.get_category(); 
            if(cat_data.length > 0){
                  for(let i = 0; i<cat_data.length;i++){
                      var product_data = [];
                      var cat_id = cat_data[i]['_id'].toString();
                    const cat_pro = await Product.find({category_id:cat_id})
                    if(cat_pro.length > 0 ){
                        for(let j =0;j <cat_pro.length;j++ ){
                         var store_data = await store_controller.get_store(cat_pro[j]["store_id"]);
                         product_data.push(
                            {
                                "product_name":cat_pro[j]['name'],
                                "images":cat_pro[j]["images"],
                                "store_adress":send_data["address"]
                            }
                            )
                        }
                    }
                    send_data.push({
                        "category":cat_data[i]["category"],
                        "product":product_data
                    })
                   }
                   res.status(200).send({success:true,msg:"Product details,",data:send_data});
            }else{
                res.send({success:true,msg:"product details",data:send_data}).status(200)
            }
    } catch (error) {
        res.send({success:false,msg:error.message}).status(400)
    }
}

const search_product = async(req,res) => {
    try {
          var search = req.body.search;
         const producut_data = await Product.find({"name":{$regex:".*"+search+".*",$options:"i"} });
         if(producut_data.length > 0){
               res.status(200).send({success:true,message:"Product Deatials",msg:producut_data})
         }else{
            res.send({success:true,msg:"Product not found !"}).status(400)
         }
    } catch (error) {
        res.send({success:false,msg:error.message}).status(400)
    }
}


const paginate = async(req,res) => {
   try {
     var page = req.body.page;
     var sort = req.body.sort;
     var product_Data;
     var skip;
     if(page <= 1){
        skip = 0
     }else{
        skip = (page-1)*2
     }
     if(sort){
        let customSort;
        if(sort === 'name'){
             customSort = {
                name:1
             }
        }
        
        product_Data = await Product.find().sort(customSort).skip(skip).limit(2);
     }else{
        product_Data = await Product.find().skip(skip).limit(2);
     }
     res.send({success:true,msg:"product details",data:product_Data}).status(200);

   } catch (error) {
    res.send({success:false,msg:error.message}).status(400)
   }
}

module.exports = {  
    add_product,
    get_product,
    search_product,
    paginate
}