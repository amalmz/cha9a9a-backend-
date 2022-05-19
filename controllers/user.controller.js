const User = require('../models/user');
const db = require("../models/roles")
const Users = db.user;
const Role = db.role; 
 exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };
  exports.donorBoard = (req, res) => {
    res.status(200).send("Donor Content.");
  };
  exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
  };
  exports.creatorBoard = (req, res) => {
    res.status(200).send("creator Content.");
  };

 
  exports.getAllUsers = (req,res)=>{
    User.find({},(err,users)=>{
        if(users.length === 0){
            res.status(500).json({
                message:"No user found",
                data: null 
            })
        }else{
            res.status(200).json({
                message:"Users in the system",
                data:users,
            })
        }
    }).populate("roles")
},
exports.getUserbyid =(req,res) =>{
  User.findById({_id : req.params.id}, (err , users)=>{
      if(!users){
          res.status(500).json({
              message:"user not found " +err ,
              data: null,
          });  
       }else {
           res.status(200).json({
               message:"user is found" ,
              data: users,
           });
       }
}).populate("campaign");
}

exports.UpdateRole=(req,res)=>{
  Users.findById({_id : req.params.id},(err, user) => {
    if(!user){
      res.status(500).json({
          message:"user not found " +err ,
          data: null,
      });
    }else{
      Role.findOne({ name: "creator" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        user.roles = [role._id];
        user.updateOne({_id : req.params.id},{roles : user.roles})
        user.save()
        res.send({
          data: user,
          message: "Role is successfully updated!" });
      })
    } 
 
    });
  }

  exports.deleteUser = (req,res)=>{
    User.findOneAndDelete({_id : req.params.id} ,(err,user) =>{
      if(err){
          res.status(500).json({
              message:"user is not deleted" +err ,
              data: null,
          });
       }else {
           res.status(200).json({
               message:"user is successfully deleted" ,
              data: user,
           });
       }
   });

  }
   
