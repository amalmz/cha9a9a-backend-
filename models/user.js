const mongoose = require("mongoose");
const User = new mongoose.Schema({
 name:{
  type : String ,
  required :true 
  },
  lastname:{
    type : String ,
    required :true 
},
 tel:{
   type: Number ,
   required: true ,
 },
 email:{
   type : String ,
   required :true ,
   unique : true ,
  lowercase:true ,
},
 password:{
    type : String ,
    required :true 
},
verified:Boolean,
roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role"
    }
  ],
campaign:[
  {
    type:mongoose.Schema.Types.ObjectId,
    ref:"Campaign"
  }
],
donation:[
  {
    type:mongoose.Schema.Types.ObjectId,
    ref:"Donation"
  }
],
requests:[
  {
    type:mongoose.Schema.Types.ObjectId,
    ref:"Request"
  }
]


});

module.exports = mongoose.model("User",User)