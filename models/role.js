const mongoose = require("mongoose");
const Role = new mongoose.Schema({   // A mongoose schema defines the structure of the document
    name:{
        type:String,
    }
})
module.exports = mongoose.model("Role",Role); // Mongoose model provides an interface to the database for creating, querying, updating, deleting records, etc