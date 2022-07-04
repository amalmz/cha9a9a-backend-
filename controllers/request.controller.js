const Request = require('../models/request');
const User = require('../models/user');


module.exports = {
    createRequest :async(req,res)=>{
        const request = new Request({
            subject:req.body.subject,
            objective:req.body.objective,
            id_card:req.file.filename,
            user_id:req.userId,
        })
        try{
        let requestData = await request.save()
        await User.findByIdAndUpdate({_id:req.userId},{
    	$push:{
            requests : requestData
        }})
        return res.status(200).json({
            message:'Request is succssfully created',
            data:requestData,
        })
        
          }catch(err){
            return res.status(400).json({
                message:err.message,
                data:err
             })
          }

},
getallrequests:(req,res)=>{
    Request.find({},(err,requests)=>{
       if(requests.length === 0){
           res.status(500).json({
               message :"no requests found",
               data : null ,
           });
       } else {
           res.status(200).json({
               message : "requests in the system",
               data: requests,
           });
       }    
    }).populate("user_id");
},
}