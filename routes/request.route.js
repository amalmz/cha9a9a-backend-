const express = require('express');
const { isCreator, verifyToken, isAdmin } = require('../middleware/auth');
const RequestController= require('../controllers/request.controller');
const upload = require('../middleware/upload');
const route = express.Router();

route.post('/create',upload.single('id_card'),verifyToken,RequestController.createRequest);
route.get('/all',verifyToken,RequestController.getallrequests);


module.exports=route;