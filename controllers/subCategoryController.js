const SubCategory = require("../models/subCategoryModel");

const create_subcategory = async (req, res) => {
    try {
        const check_sub = await SubCategory.find({ category_id: req.body.category_id });

        if (check_sub.length > 0) {

            let checking = false;
            for (let i = 0; i < check_sub.length; i++) {
                if (check_sub[i]['sub_category'].toLowerCase() === req.body.sub_category.toLowerCase()){
                    checking = true;
                    break;    
                }
            }
        

        if (checking === false) {
          const subCategory = new SubCategory({
                category_id: req.body.category_id,
                sub_category: req.body.sub_category
            });
            const sub_cat_data = await subCategory.save();
            res.status(200).send({ succsess: true, msg: "subcategory details", data: sub_cat_data })
        }

        else {
            res.status(200).send({ succsess: true, msg: "This sabcategory " + req.body.sub_category+ " is already exist" });
        }

       }else{
        const subCategory = new SubCategory({
            category_id: req.body.category_id,
            sub_category: req.body.sub_category
        });
        const sub_cat_data = await subCategory.save();
        res.status(200).send({ succsess: true, msg: "subcategory details", data: sub_cat_data })
       }


    } catch (error) {
        res.status(400).send({ succsess: false, msg: error.message })
    }
}

module.exports = {
    create_subcategory
}