const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({

    text:{
        type:String,
        required:true
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
module.exports = mongoose.model("Comment",CommentSchema);