const Product = require("../models/productModel");
const  User = require("../models/userModel");
const Category = require("../models/categoryModel");
const subCategory = require("../models/subCategoryModel");

const data_count = async(req,res) => {
    try {
        const count_data = [];
        const product_data = await Product.find().count();
        const vendor_Data = await User.find({type:2}).count();
        const categgory_data = await Category.find().count();
        const Subcateggory_data = await subCategory.find().count();

        count_data.push({
            prodcut:product_data,
            vendor:vendor_Data,
            category:categgory_data,
            sub_Category:Subcateggory_data

        })
        res.status(200).send({success:true,msg:"count data",data:count_data})
    } catch (error) {
        res.status(400).send({success:false,msg:error.message})
    }
}

module.exports = {
    data_count
}