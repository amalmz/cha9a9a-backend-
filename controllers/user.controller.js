const User = require('../models/user');
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
                data:users
            })
        }
    })
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
});
}

exports.UpdateRole=(req,res)=>{
   

}
