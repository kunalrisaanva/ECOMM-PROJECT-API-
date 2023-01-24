const Address = require("../models/address");

const add_address = async(req,res) => {
    
    try {
        const data = await Address.findOne({user_id:req.body.user_id});
        if(data){
            var addAddress = [];

            for(let i = 0; i<data.address.length;i++){
                addAddress.push(data.address[i])
            }
            addAddress.push(req.body.address);
            const updatedData = await Address.findOneAndUpdate(
                {user_id:req.body.user_id},
                {$set:{address:addAddress}},
                {returnDocument:"after"}
            )
            res.status(200).send({succsess:true,msg:"data",data:updatedData});

        }else{
            const address = new Address({
                user_id:req.body.user_id,
                address:req.body.address
            })
            const addres_data = await address.save();
            res.status(200).send({succsess:true,msg:"Address Details",addressData:addres_data});
        }
    } catch (error) {
        res.status(400).send({succsess:false,msg:error.message})
    }
}

module.exports = {
    add_address
}