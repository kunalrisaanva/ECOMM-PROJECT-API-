const Store = require("../models/storeModel");
const User = require("../models/userModel")


const create_store = async(req,res) => {
     try {
       const userData = await User.findOne({_id:req.body.vendor_id });
       if(userData){
          if(!req.body.latitude || !req.body.longitude){
            res.status(200).send({succsess:false,msg:"lat and long not found"})
          }else{
             const vendorData =  await  Store.findOne({vendor_id:req.body.vendor_id});
             if(vendorData){
                res.status(200).send({succsess:false,msg:"this vendor is already created store.."})
             }else{
                   const store = new Store({
                    vendor_id:req.body.vendor_id,
                     logo:req.file.filename,
                     business_email:req.body.business_email,
                     address:req.body.address,
                     pin:req.body.pin,
                     location:{
                        type:"Point",
                        coordinates:[parseFloat(req.body.longitude),parseFloat(req.body.latitude)]
                     }
                   });
                  const storeData =  await store.save();
                  res.status(200).send({succsess:true,msg:"store data",Data:storeData})
             }
          }
       }else{
        res.status(200).send({succsess:false,msg:"Vendor ID does not exists"});
    }

     } catch (error) {
        res.status(400).send(error.message)
     }
}

const get_store = async(id) => {
    try {
      return Store.findOne({_id:id})
    } catch (error) {
      res.status(400).send(error.message)
    }
}

// find nearest store 


const find_store = async(req,res) => {
   try {
     const {longitude,latitude} = req.body;

    const  store_data = await  Store.aggregate([
         {
            $geoNear:{
              near:{type:"Point",coordinates:[parseFloat(longitude),parseFloat(latitude)]},
              key:"location",
              maxDistance:parseFloat(2000)*1609,
              distanceField:'dist.calculated',
              spherical:true
            }
         }
      ]);
      res.status(200).send({succsess:true,message:"store details",data:store_data})
   } catch (error) {
      res.status(400).send(error.message)
   }
}

module.exports = {
    create_store,
    get_store,
    find_store
}  