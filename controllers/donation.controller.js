const Donation = require('../models/donation')
const Campaign = require('../models/campaign');
const User = require('../models/user')
module.exports = {
    createdonation :async(req,res)=>{
        const doantion = new Donation({
            name:req.body.name,
            lastname:req.body.lastname,
            donateamount:req.body.donateamount,
            anonymous:req.body.anonymous,
            status:"false",
            campaign_id:req.params.campaign_id,
            user_id:req.userId
        })
        try{
            let donationsuccess = await doantion.save();
             await Campaign.findByIdAndUpdate({_id:req.params.campaign_id},{
                 $push:{
                      donations : donationsuccess
                 }
              })
              await User.findByIdAndUpdate({_id:req.userId},{
                $push:{
                    donation : donationsuccess
                }
             })
            return res.status(200).json({
                message:'Donation is succssfully created',
                data:donationsuccess,
            })
        }catch(err){
            console.log(err);
            return res.status(400).json({
                message:err.message,
                data:err
             })
        }
    },
   Updatedonation:async(req,res)=>{
       DonorId = req.body.DonorId;
    try{
        const result = await Donation.findByIdAndUpdate({_id:DonorId},{status:"true"})
      return res.send({status:true,resultat:result})
    }catch(err){
        return res.status(400).json({
            message:err.message,
            data:err
         })
    }
   }

}