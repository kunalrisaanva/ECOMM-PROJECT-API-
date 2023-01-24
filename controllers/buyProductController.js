const buyProduct = require("../models/buyProductModel");


const buy_product = async(req,res) => {
    try {
      const buy_Product =  new  buyProduct({
            product_id:req.body.product_id,
            transection_id:req.body.transection_id,
            vendor_id:req.body.vendor_id,
            store_id:req.body.store_id,
            customer_id:req.body.customer_id,
        });
      const buy_product_data =   await buy_Product.save();
      res.status(200).send({succsess:true,msg:"buy Product Deatails",data:buy_product_data})
    } catch (error) {
        res.status(400).send({succsess:false,msg:error.message})
    }
}

module.exports = {
    buy_product
}