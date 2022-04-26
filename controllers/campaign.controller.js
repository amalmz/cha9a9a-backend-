const Campaign = require('../models/campaign');
const { mongoose } = require('../models/roles');
const Comment = require('../models/comments');

module.exports = {
    createCampaign :(req,res)=>{
        let data ={
            name:req.body.name,
            objective:req.body.objective,
            description:req.body.description,
            image:req.body.filename,
            category: req.body.category,
            created_by:req.userId
        }

    Campaign.create(data,(err,campaign)=>{

        if(err){
            res.status(500).json({
                message: 'campaign not created'+err,
                data: null,
            });
        }else {
            res.status(201).json({
                message: 'campaign is successfuly created',
                data: campaign,
            });
        }

    })

},
    getAllCampaigns :async(req,res)=>{
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skipIndex = (page - 1) * limit;
        const total = await Campaign.countDocuments({});
        const campaigns = await Campaign.find({})
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
   });
    },

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
                       description:req.body.description,
                       image:req.body.filename,
                       category: req.body.category,
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
                     await Campaign.deleteOne({_id:campaign_id});
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
}