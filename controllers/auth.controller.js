require('dotenv').config()
const config = require("../config/auth.config");
const db = require("../models/roles");
const User = db.user;
const Role = db.role;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs"); //this is for password bcryption
const nodemailer = require("nodemailer");
const UserVerification = require("../models/userVerification");
ResetURL="http://localhost:4200/resetpassword";
const token = require("../models/token")
exports.signup = (req, res) => {
    const user = new User({
      name:req.body.name,
      lastname:req.body.lastname,
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
      auth:{
        user: "duetodata1234@gmail.com",
        pass: "finaksxarbofomyr"
    },
      tls:{
          rejectUnauthorized: false
      }
   
   });

   let mailOptions = {
     from: "duetodata1234@gmail.com",
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
        user.token= token 
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

  };

//   exports.requestPasswordReset = async (req, res) => {
//     const user = await User.findOne({email: req.body.email});
//     if (!user) throw new Error("Email does not exist");

//     let token = await Token.findOne({ userId: user._id });

//     if (token) await token.deleteOne(); // to delete the previous one and create a new one 

//     let resetToken = crypto.randomBytes(32).toString("hex");
//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(resetToken.toString(), salt);
//   const tok=  await new Token({
//         userId: user._id,
//         token: hash,
//         createdAt: Date.now(),
//     }).save();
//     const link = `${ResetURL}?token=${resetToken}&id=${user._id}`;
//     let transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//             user:"duetodatasousse@gmail.com",

//             pass:"duetodata123" ,
//         },
//         tls:{
//             rejectUnauthorized: false
//         }
//     });
//     let mailOptions = {
//         from: "duetodatasousse@gmail.com",
//         to:email,
//         subject: 'Réinitialisation du mot de passe ✔',
//         text:
//             'Bonjour '+
//             user.email +
//             '\n' +
//             'Vous recevez ceci parce que vous avez demandé la réinitialisation du mot de passe de votre compte.' +
//             '\n' +
//             'Veuillez cliquer sur le lien suivant ou le coller dans votre navigateur pour terminer le processus:' +
//             '\n' +link +'\n' +
//              "Si vous ne l'avez pas demandé, veuillez ignorer cet e-mail et votre mot de passe restera inchangé",

//     };
//     console.log(mailOptions);
//     transporter
//         .sendMail(mailOptions)
//         .then(() => {
//             console.log("reset email sent");
//         })
//         .catch((error) => {
//             console.log(error);
//         });
// }

// exports.resetPassword = async (req, res) => {
//     let {userId, token, password}= req.body
//     let passwordResetToken = await Token.findOne({ userId });
//      if (!passwordResetToken) {
//         throw new Error("Invalid or expired password reset token");
//     }
//     console.log(passwordResetToken)

//     const isValid = await bcrypt.compare(token, passwordResetToken.token);
//      if (!isValid) {
//         throw new Error("Invalid or expired password reset token");
//     }
//      const salt = await bcrypt.genSalt(10);
//      if (!salt) throw Error("Something went wrong with bcrypt");
//      const hash = await bcrypt.hash(password.toString(), salt);
//      if (!hash) throw Error("Something went wrong hashing the password");

//     await User.findByIdAndUpdate(
//         { _id: userId },
//         { $set: { password: hash } },
//         { new: true }
//     );

//     const user = await User.findById({ _id: userId });
//     await passwordResetToken.deleteOne();

//     return true;
// }
