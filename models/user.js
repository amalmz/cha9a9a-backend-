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
roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role"
    }
  ]


});

module.exports = mongoose.model("User",User)