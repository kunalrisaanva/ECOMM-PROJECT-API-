const cartModel = require("../models/cartModel");

const add_to_Cart = async(req,res) => {
    try {
      const cart_obj = new cartModel({
            product_id:req.body.product_id,
            price:req.body.price,
            vendor_id:req.body.vendor_id,
            store_id:req.body.store_id
        });
        const cartData = await cart_obj.save();
        res.status(200).send({success:true,msg:"cart Product details",data:cartData})
    } catch (error) {
        res.status(400).send({success:false,msg:error.message})
    }
}

module.exports = add_to_Cart
