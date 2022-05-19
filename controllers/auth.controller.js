const config = require("../config/auth.config");
const db = require("../models/roles");
const User = db.user;
const Role = db.role;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs"); //this is for password bcryption
const nodemailer = require("nodemailer");
const UserVerification = require("../models/userVerification");

exports.signup = (req, res) => {
    const user = new User({
      name:req.body.name,
      lastname:req.body.name,
      tel:req.body.tel,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      verified:false,
    });
     user.save((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (req.body.roles) {
         Role.find(
          {
            name: { $in: req.body.roles }
          },
          (err, roles) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            user.roles = roles.map(role => role._id);
            user.save(err => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
              res.send({
                data: user,
                 message: "User was registered successfully!" 
                });
            })
          }
        );
      } else {
         Role.findOne({ name: "donor" }, (err, role) => { // if we don't specify the role it will be donor by default

          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          user.roles = [role._id];
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            res.send({
              data: user,
              message: "User was registered successfully!" });
          })
        });
      }
    })

    const otp = Math.floor(`${1000+Math.random()*9000}`);
    let transporter = nodemailer.createTransport({
      service: "gmail",
       auth: {
           user:"duetodatasousse@gmail.com",
           pass:"duetodata123" ,
       },       tls:{
           rejectUnauthorized: false
       }
   });

   let mailOptions = {
     from: "duetodatasousse@gmail.com",
     to:user.email,
     subject: 'Verification code ✔',

     text:
         'Hello '+
         user.name +
         '\n' +
         'Enter '+ otp +' in the app to verify your email address and complete the sign up proceess' +
         '\n' +
         'This code expires in 1 hour  '
 };
  console.log(mailOptions);
  const newOtp =  new UserVerification({
    userId:user._id,
    otp:bcrypt.hashSync(otp.toString(),10),
    createdAt:Date.now(),
    expiresIn: Date.now() + 3600000 ,
  });
  console.log(newOtp);
    newOtp.save();
 transporter.sendMail(mailOptions).then(() => {
         console.log("verification code is sent");
     })
     .catch((error) => {
           console.log(error);

     });
  };




  exports.signin = (req, res) => {
    User.findOne({
      email: req.body.email
    })
      .populate("roles", "-__v")
      .exec((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }
        // if(!user.verified){   //nraj3ou mba3id 
        //   return res.status(401).send({message:"your account is not verified.Please verify your account"})
        // }
        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!"
          });
        }
        var token = jwt.sign({ id: user.id }, config.secret, {
          expiresIn: 86400 // the token is valid for 24 hours
        });
        var authorities = [];
        for (let i = 0; i < user.roles.length; i++) {
          authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user._id,
          email: user.email,
          roles: authorities,
          accessToken: token
        });
      });
  };

  // const SendOtpVerification = async({_id,email},res) =>{
  //   const otp = Math.floor(`${1000+Math.random()*9000}`);
  //     let transporter = nodemailer.createTransport({
  //       service: "gmail",
  //       auth: {

  //           user:"duetodatasousse@gmail.com",
  //           pass:"duetodata123" ,
  //       },
  //       tls:{
  //           rejectUnauthorized: false
  //       }
  //   });
  //   try{
  //   let mailOptions = {
  //     from: "duetodatasousse@gmail.com",
  //     to: email,
  //     subject: 'Verification code ✔',

  //     html:
  //         '<p>Hello</p> '+
  //         user.name +
  //         '<p> Enter ${otp} in the app to verify your email address and complete the sign up proceess </p>' +
  //         '</p> This code expires in 1 hour </p>  '
  // };
  //    const saltRounds = 10;
  //    const hasedOtp = await bcrypt.hash(otp,saltRounds);
  //    const newOtp =  await new UserVerification({
  //      userId:_id,
  //      otp:hasedOtp,
  //      createdAt:Date.now(),
  //      expiresIn: Date.now() + 3600000 ,
  //    });
  //     await newOtp.save();
  //     await transporter.sendMail(mailOptions);
  //     res.json({
  //       status:"PENDING",
  //       message:"Verification otp email is sent",
  //       data:{
  //         userId:_id,
  //         email
  //       }
  //     })
  //   }catch(err){
  //    res.json({
  //      status:"FAILED",
  //      message:error.message
  //    })
  //   }
  // }


  exports.verifyOtp = async(req, res) => {
    try{
      let{ userId , otp } = req.body;
      if(!userId || !otp){
        res.status(404).send({
          message:"Empty otp"
        })
      }else{
        const UserOtpVerificationrecord = await UserVerification.find({
          userId
        });
            if(UserOtpVerificationrecord.length <= 0){
          // if the record has been found 
          res.status(500).send({
            message:"Account record doesn't exist or has been verified already"
          })
            }else{
             // if the user record exists
             const {expiresAt} = UserOtpVerificationrecord[0];
             const hashedOtp = UserOtpVerificationrecord[0].otp;
                 if(expiresAt < Date.now()){
                  // if the code has expired
                 await UserVerification.deleteMany({userId});
                 res.status(500).send({
                  message:"Code has expired"
                })
                }else{
                 const validOTP = await bcrypt.compare(otp,hashedOtp); 
                    if(!validOTP){
                      res.status(500).send({
                        message:"Invalid code passed. check you inbox"
                      })
                    }else{
                       await User.updateOne({_id:userId},{verified:true});
                       await UserVerification.deleteMany({userId});
                       res.status(200).send({
                          status:"VERIFIED",
                          message:'User email verified successfully'
                       })
                    }
                } }
      }
    }catch(err){
      res.status(500).send({
         status:"FAILED",
         message:err
       })

    }

  }