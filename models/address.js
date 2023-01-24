const mongoose = require("mongoose");

const addresSchema = mongoose.Schema({
    user_id: {
        type:String,
        required:true
    },
    address:{
        type:Array,
        required:true
    }
})

module.exports = mongoose.model("addres",addresSchema);