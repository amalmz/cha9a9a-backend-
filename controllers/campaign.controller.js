const Campaign = require('../models/campaign');
const { mongoose } = require('../models/roles');
const Comment = require('../models/comments');
const User = require('../models/user')

module.exports = {
    createCampaign :async(req,res)=>{
        const campaign = new Campaign({
            name:req.body.name,
            objective:req.body.objective,
            category: req.body.category,
            description:req.body.description,
            image:req.file.filename,
            status:"Waiting",
            created_by:req.userId
        })
        try{
        let campaignData = await campaign.save()
        await User.findByIdAndUpdate({_id:req.userId},{
    	$push:{
            campaign : campaignData
        }})
        return res.status(200).json({
            message:'Campaign is succssfully created',
            data:campaignData,
        })
        
          }catch(err){
            return res.status(400).json({
                message:err.message,
                data:err
             })
          }

},
    getAllCampaigns :async(req,res)=>{
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skipIndex = (page - 1) * limit;
        const total = await Campaign.countDocuments({});
        const campaigns = await Campaign.find({}).populate("category").populate("created_by")
        .limit(limit)
        .skip(skipIndex)
        if(campaigns.length === 0){
            res.status(500).json({
                message :"no campaign is found",
                data : null ,
            });
        }else{
            res.status(200).json({
                message:"list of campaigns",
                total:total,
                totalPages:Math.ceil(total/limit),
                data:campaigns
            })
        }
    },
    getCampaignsbyid :(req,res) =>{
        Campaign.findById({_id : req.params.id}, (err , campaigns)=>{
          if(!campaigns){
              res.status(500).json({
                  message:"campaigns not found " +err ,
                  data: null,
              });
           }else {
               res.status(200).json({
                   message:"campaigns is found" ,
                  data: campaigns,
               });
           }
   }).populate("created_by").populate({path:"comments",populate:{path:"user_id"}});
    },

    // getCampaignsByStatus:(req,res)=>{
    //     Campaign.find({status:{$elemMatch:'Waiting'}},(err,campaigns)=>{
    //         if(campaigns.length === 0){
    //             res.status(500).json({
    //                 message:"campaigns not found " +err ,
    //                 data: null,
    //             });
    //          }else {
    //              res.status(200).json({
    //                  message:"campaigns is found" ,
    //                 data: campaigns,
    //              });
    //          }
    //     })
    // },

    updateCampaign:async(req,res)=>{
        let campaign_id = req.params.campaign_id;
        if(!mongoose.Types.ObjectId.isValid(campaign_id)){
          return res.status(400).json({
              message:"Invalid id campaign",
              data:{}
          });
      }
      Campaign.findOne({_id:campaign_id}).then(async(campaign)=>{
          if(!campaign){
              return res.status(400).json({
                 message:"No campaign found",
                 data: {}
              });
          }else{
              let current_user= req.userId
                if(campaign.created_by!=current_user){
                  return res.status(400).json({
                      message:"Access denied",
                      data:{}
                  });
                }else{
                   try{
                     await Campaign.updateOne({_id:campaign_id},{
                       name:req.body.name,
                       objective:req.body.objective,
                       category: req.body.category,
                       description:req.body.description,
                       image:req.body.filename,
                     });
                      return res.status(200).json({
                       message:"Campaign is successfully updated",
                       data:campaign
                     });
                }catch(err){
                    return res.status(400).send({
                        message:err.message,
                        data:err
                    });

                }
              }
          }
      }).catch((err)=>{
        res.status(400).json({
            message:err.message ,
           data: null,
        });
      })
    },
    deleteCampaign:async(req,res)=>{
     let campaign_id = req.params.campaign_id;
      Campaign.findOne({_id:campaign_id}).then(async(campaign)=>{
          if(!campaign){
              return res.status(400).json({
                 message:"No campaign found",
                 data: {}
              });
          }else{
              let current_user= req.userId
                if(campaign.created_by!=current_user){
                  return res.status(400).json({
                      message:"Access denied",
                      data:{}
                  });
                }else{
                   try{
                     await Campaign.deleteOne({_id:campaign_id});
                          let comment = campaign.comments;
                         const CommentId = comment.map(id => {
                          return id
                          })
                        for(let i=0;i<=CommentId.length; i++){
                         await Comment.deleteOne({_id: CommentId[i]})
                        }
                      return res.status(200).json({
                       message:"Campaign is successfully deleted",
                       data:campaign
                     });
                }catch(err){
                    return res.status(400).send({
                        message:err.message,
                        data:err
                    });

                }
              }
          }
      }).catch((err)=>{
        res.status(400).json({
            message:err.message ,
           data: null,
        });
      })
    },

    updateCampaignEtat:async(req,res)=>{
        let campaign_id = req.params.campaign_id;
        var status = req.body.status
        const Allstatus = ["Waiting","Accept","Reject","Published"];
        var ok = false ;
        for(i = 0; i < Allstatus.length; i++){
            if(status == Allstatus[i] ){
                ok = true
            }
        }
        if(!ok){
           return res.status(400).send({status:false})
        }
        const result = await Campaign.findByIdAndUpdate({_id:campaign_id},{status:status})
        return res.send({status:true,resultat:result})

    }
    // getCommentsByCampaign:async(req,res)=>{
    //     let campaign_id = req.params.campaign_id;
    //     try{
    //         const CammpaignComments = await Campaign.find({_id :campaign_id}).populate("comments")
    //          return res.status(200).json({
    //            message:"comments of campaign",
    //            data:CammpaignComments
    //        })

    //     }catch(err){
    //         return res.status(400).json({
    //             message:err.message ,
    //             data: err,
    //         })

    //     }
    // }
}