const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema({
    name:{
        type: String,
    },
    lastname:{
        type:String,
    },
    donateamount:{
        type:Number,
        required:true
    },
    anonymous:{
       type:Boolean, 
    },
    status:{
        type:Boolean
    },
    campaign_id:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Campaign',
    },
    user_id:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User',
    }
  },{
      timestamps:true,
});
module.exports = mongoose.model("Donation",DonationSchema);