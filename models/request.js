const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
    subject:{
        type:String ,
        required:true
    },
    description:{
        type:String ,
    },
    id_card:{
        type:String ,
    },
    status:{
        type:Boolean
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    } 
})
module.exports = mongoose.model("Request",RequestSchema);