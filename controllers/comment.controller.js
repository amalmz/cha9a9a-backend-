const Comment = require('../models/comments');
const Campaign = require('../models/campaign');
const mongoose = require("mongoose");

exports.create = async (req,res)=>{
    let campaign_id = req.params.campaign_id
    if(!mongoose.Types.ObjectId.isValid(campaign_id)){
		return res.status(400).json({
	  		message:'Invalid campaign id',
	  		data:{}
	  	});
	} 
    Campaign.findOne({_id:campaign_id}).then(async(campaign)=>{
        if(!campaign){
            return res.status(400).json({
				message:'No campaign found',
				data:{}
			});
        }else{
           try{

            let newComment = new Comment({
                text:req.body.text,
                campaign_id:campaign_id,
                user_id:req.userId
            });
            let commentData = await newComment.save();
            await Campaign.updateOne({_id:campaign_id},{$push:{comments:commentData_id}})
            return res.status(200).json({
                message:'Comment successfully added',
                data:commentData
            }); 
            
        }catch(err){
            return res.status(400).json({
                message:err.message,
                data:err
            });

        }
        }
    })


} 

exports.list=(req,res)=>{
    let campaign_id = req.params.campaign_id
    if(!mongoose.Types.ObjectId.isValid(campaign_id)){
		return res.status(400).json({
	  		message:'Invalid campaign id',
	  		data:{}
	  	});
	} 
    Campaign.findOne({_id:campaign_id}).then(async (campaign)=>{
		if(!campaign){
			return res.status(400).json({
				message:'No campaign found',
				data:{}
			});	
		}else{
            try{
                let query=[
					{
						$lookup: // we use lookup documents from another collection and in our case user collection 
						{
						 from: "users", 
						 localField: "user_id", 
						 foreignField: "_id",
						 as: "user"
						}
					},
					{$unwind: '$user'},
					{
						$match:{
							'campaign_id':mongoose.Types.ObjectId(campaign_id) // the campaign id needs to match
						}
					},
                ]
				let comments=await Comment.aggregate(query);
                 return res.status(200).json({
		  		     message:'Comment successfully fetched',
			  		 data:comments,
                });
            }catch(err){
				return res.status(400).send({
			  		message:err.message,
			  		data:err
			  	});
			}

        } 
    })
}