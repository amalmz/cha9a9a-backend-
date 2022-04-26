const { auth } = require("../middleware");
const express = require('express')
const route = express.Router()
const Usercontroller = require("../controllers/user.controller");

route.get("/api/test/all", Usercontroller.allAccess);
route.get("/api/test/user", [auth.verifyToken], Usercontroller.donorBoard);
route.get( "/api/test/creator",[auth.verifyToken, auth.isCreator],Usercontroller.creatorBoard);
route.get("/api/test/admin",[auth.verifyToken, auth.isAdmin],Usercontroller.adminBoard);
route.get("/all",[auth.verifyToken, auth.isAdmin],Usercontroller.getAllUsers);
route.get("/:id",Usercontroller.getUserbyid);

module.exports=route;