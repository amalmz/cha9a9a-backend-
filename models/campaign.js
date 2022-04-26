const mongoose = require("mongoose");

const CampaignSchema = new mongoose.Schema({
   name:{
    type : String ,
    required :true 
  },
  objective:{
    type: Number ,
    required: true ,
  },
   collected:{
    type : Number ,
  },
   participants:{
    type : Number ,
  },
  description:{
      type:String ,
      required:true
  },
  image:{
      type:String ,
  },
  category :{
    type: mongoose.Schema.Types.ObjectId, // hetha foreign key  
    ref : 'Category',
},
  created_by:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  comments:[
    {  type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }
 ],
},
{
    timestamps:true, // mongoose option that automattically manage createdAt and updatedAt 
});

module.exports = mongoose.model("Campaign",CampaignSchema);