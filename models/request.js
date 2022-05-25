const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
    subject:{
        type:String ,
        required:true
    },
    description:{
        type:String ,
        required:true
    },
    id_card:{
        type:String ,
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    } 
})
module.exports = mongoose.model("Request",RequestSchema);