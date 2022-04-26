const Category = require('../models/category');
module.exports = {
    createcategory :(req,res) => { // il data fichier(image) w json  for two different data s 
      
        let data = {
            name: req.body.name ,
        }
        Category.create(data ,(err,category)=>{
            if(err){
                res.status(500).json({
                    message: 'category not created'+err,
                    data: null,
                });
            }else {
                res.status(201).json({
                    message: 'category is successfuly created',
                    data: category,
                });
            }
        });
  },

  getallcategories:(req,res)=>{
      Category.find({},(err,categories)=>{
         if(categories.length === 0){
             res.status(500).json({
                 message :"no categories found",
                 data : null ,
             });
         } else {
             res.status(200).json({
                 message : "categories in the system",
                 data: categories,
             });
         }    
      });
  },
  updatecategory :(req,res)=>{
      let data ={
          name: req.body.name ,
          
      }
    Category.findByIdAndUpdate({_id : req.params.id}, data ,(err , category) => {
        if(!category){
            res.status(500).json({
                message:"category is not updated" +err ,
                data: null,
            });
         }else {
             res.status(200).json({
                 message:"category is successfully updated" ,
                data: category,
             });
         }

     });
},

      deletecategory:(req,res) =>{

       Category.findByIdAndDelete({_id : req.params.id} ,(err,category) =>{
            if(err){
                res.status(500).json({
                    message:"category is not deleted" +err ,
                    data: null,
                });
             }else {
                 res.status(200).json({
                     message:"category is successfully deleted" ,
                    data: category,
                 });
             }
         });
},

  getcategorybyid :(req,res) =>{
      Category.findById({_id : req.params.id}, (err , category)=>{
        if(!category){
            res.status(500).json({
                message:"category not found " +err ,
                data: null,
            });  
         }else {
             res.status(200).json({
                 message:"category is found" ,
                data: category,
             });
         }
 });
  }

}