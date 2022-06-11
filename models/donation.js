const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema({
    name:{
        type: String,
    },
    last_name:{
        type:String,
    },
    amount:{
        type:Number,
        required:true
    },
    anonymous:{
       type:Boolean, 
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