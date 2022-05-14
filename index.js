const express = require ('express') ; //Express is for building the Rest apis
const mongoose = require('mongoose') ;
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors') // cors provides Express middleware to enable CORS (so we can access this API rest in our frontend application )
const db = require("./models/roles");
const Role = db.role;
const commentRoute = require('./routes/comment.route');
const campaignRoute = require('./routes/campaign.route');
const categoryRoute= require('./routes/category.route');
const userRoute= require('./routes/user.route');


mongoose.connect('mongodb://127.0.0.1:27017/database', {useNewUrlParser:true}, {useUnifiedTopology:true}); 
const database = mongoose.connection 

database.on('error', (err) => {
    console.log(err)
})
database.once('open', () => {
    console.log('Database connection is Established ')
})
app.use(function(req, res, next) { res.header("Access-Control-Allow-Headers","x-access-token, Origin, Content-Type, Accept");next();});
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true} )); // so he can read the body even if it's writen in json or urlrncoded
app.use("/campaign",campaignRoute);
app.use("/comment",commentRoute);
app.use("/category",categoryRoute);
app.use("/users",userRoute)
require('./routes/auth.route')(app);


  
const Port = process.env.Port || 5000 
app.listen(Port,()=> {
    console.log(`server is running on port ${Port}`)
})
app.get("/getfile/:image", function (req, res) {
  res.sendFile(__dirname + "/uploads/" + req.params.image);
});


 //this function helps us to create 3 important rows in roles collection
  Role.estimatedDocumentCount( function (err, count) {
    if (!err && count === 0) {
      new Role({
        name: "donor"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'donor' to roles collection");
      });
      new Role({
        name: "creator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'creator' to roles collection");
      });
      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'admin' to roles collection");
      });
    }
  });

