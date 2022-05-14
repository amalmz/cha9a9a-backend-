const Comment = require('../models/comments');
const Campaign = require('../models/campaign');

module.exports = {
   createComment :(req,res)=> {
	   let campaign_id = req.params.campaign_id
	   console.log(campaign_id)
	   Campaign.findOne({_id:campaign_id}).then(async(campaign)=>{
	      if(!campaign){
			  return res.status(400).json({
			   message:'No campaign found',
			   data:{}
			  })
		   }else{
				  try{
					const comment = new Comment({
						text:req.body.text,               
						campaign_id:campaign_id,
						user_id:req.userId
					   })
					let commentData = await comment.save();
                    await Campaign.updateOne({_id:campaign_id},{
						$push:{
							comments : commentData
						}
					})
					return res.status(200).json({
						message:'Comment is succssfully created',
						data:commentData,
					})
				}catch(err){
					return res.status(400).json({
						message:err.message,
					    data:err
					 })
				  }

				}
             })
	},
	updateComment:(req,res)=>{
		Comment.findOne({_id : req.params.id}).then(async(comment)=>{
			if(!comment){
				return res.status(400).json({
				   message:"No comment found",
				   data: {}
				});
			}else{
				let current_user= req.userId;
			    if(comment.user_id!=current_user){
			       return res.status(400).json({
				   message:"access denied",
				   data:{},
			      });
                }else{
					try{
						await Comment.updateOne({_id : req.params.id},{
							text:req.body.text
						});
						return res.status(200).json({
							message:"Comment successfully updated",
							data:comment
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
			return res.status(400).send({
				  message:err.message,
				  data:err
			  });
		})
	},

	deleteComment:(req,res)=>{
      Comment.findOne({_id : req.params.id}).then(async(comment)=>{
          if(!comment){
              return res.status(400).json({
                 message:"No comment found",
                 data: {}
              });
          }else{
			    let current_user= req.userId;
			    if(comment.user_id!=current_user){
			       return res.status(400).json({
				   message:"access denied",
				   data:{},
			      });
			    }else{
					try{
						await Comment.deleteOne({_id : req.params.id})
						await Campaign.updateOne({_id:comment.campaign_id},{$pull:{comments : req.params.id}})
							return res.status(200).json({
							  message:"Comment successfully deleted",
							  data:comment
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
	return res.status(400).send({
		  message:err.message,
		  data:err
	  });
})
}

}









































// exports.create = async (req,res)=>{
//     let campaign_id = req.params.campaign_id
//     if(!mongoose.Types.ObjectId.isValid(campaign_id)){
// 		return res.status(400).json({
// 	  		message:'Invalid campaign id',
// 	  		data:{}
// 	  	});
// 	} 
//     Campaign.findOne({_id:campaign_id}).then(async(campaign)=>{
//         if(!campaign){
//             return res.status(400).json({
// 				message:'No campaign found',
// 				data:{}
// 			});
//         }else{
//            try{

//             let newComment = new Comment({
//                 text:req.body.text,
//                 campaign_id:campaign_id,
//                 user_id:req.userId
//             });
// 			let commentData = await newComment.save();
//             await Campaign.updateOne({_id:campaign_id},{$push:{comments:commentData}})
// 			let query=[
// 				{
// 					$lookup:
// 					{
// 					 from: "users",
// 					 localField: "user_id",
// 					 foreignField: "_id",
// 					 as: "user"
// 					}
// 				},
// 				{$unwind: '$user'},
// 				{
// 					$match:{
// 						'_id':mongoose.Types.ObjectId(commentData)
// 					}
// 				},

// 			];
// 			let comments=await Comment.aggregate(query);
//             return res.status(200).json({
//                 message:'Comment successfully added',
//                 data:comments[0]
//             }); 
            
//         }catch(err){
//             return res.status(400).json({
//                 message:err.message,
//                 data:err
//             });

//         }
//         }
//     })


// } 

// exports.list=(req,res)=>{
//     let campaign_id = req.params.campaign_id
//     if(!mongoose.Types.ObjectId.isValid(campaign_id)){
// 		return res.status(400).json({
// 	  		message:'Invalid campaign id',
// 	  		data:{}
// 	  	});
// 	} 
//     Campaign.findOne({_id:campaign_id}).then(async (campaign)=>{
// 		if(!campaign){
// 			return res.status(400).json({
// 				message:'No campaign found',
// 				data:{}
// 			});	
// 		}else{
//             try{
//                 let query=[
// 					{
// 						$lookup: // we use lookup documents from another collection and in our case user collection 
// 						{
// 						 from: "users", 
// 						 localField: "user_id", 
// 						 foreignField: "_id",
// 						 as: "user"
// 						}
// 					},
// 					{$unwind: '$user'},
// 					{
// 						$match:{
// 							'campaign_id':mongoose.Types.ObjectId(campaign_id) // the campaign id needs to match
// 						}
// 					},
//                 ]
// 				let comments=await Comment.aggregate(query);
//                  return res.status(200).json({
// 		  		     message:'Comment successfully fetched',
// 			  		 data:comments,
//                 });
//             }catch(err){
// 				return res.status(400).send({
// 			  		message:err.message,
// 			  		data:err
// 			  	});
// 			}

//         } 
//     })
// }