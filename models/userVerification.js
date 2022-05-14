const mongoose = require('mongoose');
const UserVerification = new mongoose.Schema({
    userId:String,
    otp:String,
    createdAt:Date, 
    expiresAt:Date,
})

module.exports = mongoose.model("UserVerification",UserVerification)