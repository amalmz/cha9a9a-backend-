const nodemailer = require('nodemailer');
const express=require('express')
const router=express.Router()
//Step 1
let transporter = nodemailer.createTransport({
    service: 'gmail',
    host:'smtp.gmail.com',
    port: '465',
    ssl : true,
    auth:{
        user: "duetodata1234@gmail.com",
        pass: "finaksxarbofomyr"
    }
})


router.post('/email',async(req,res)=>{
   //step 2
  var message = " Nom :"+req.body.nom + "\r\n Email de client : "+req.body.email+"\r\n Sujet : "+req.body.subject+" \r\n Message : "+req.body.message;
  
  let mailOptions = {
       from: "duetodata1234@gmail.com",
       to: "duetodata1234@gmail.com",
       subject: req.body.subject,
       text: message
   }
   
   transporter.sendMail(mailOptions, function(err,data){
    if(err){
      return res.send({status:false})
    }else{
      return res.send({status:true})
    }
})
})

module.exports = router;