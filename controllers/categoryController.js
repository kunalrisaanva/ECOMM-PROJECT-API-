const Category = require("../models/categoryModel")

const add_category = async (req, res) => {
    try {

        const category_data = await Category.find();
        if (category_data.length > 0) {
            let checking = false;
            for(let i = 0; i < category_data.length; i++) {
                if (category_data[i]['category'].toLowerCase() === req.body.category.toLowerCase()) {
                    checking = true;
                    break;
                }
            }

            if (checking === false) {
                const category = new Category({
                    category: req.body.category
                });

                const cat_data = await category.save();
                res.status(200).send({ succsess: true, msg: "category Data", data: cat_data })
            } else {
                res.status(200).send({ succsess: true, msg: "This category " + req.body.category + " is already exist" });
            }

        }



    } catch (error) {
        res.status(400).send({ succsess: false, msg: error.message })
    }

}

 
// get category

const get_category = async(req,res) => {
    try {
        return Category.find();
    } catch (error) {
        res.status(400).send({ succsess: false, msg: error.message })
    }
} 

module.exports = {
    add_category,
    get_category
}