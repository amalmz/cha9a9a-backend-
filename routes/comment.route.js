const express = require('express')
const route = express.Router()
const CommentController = require('../controllers/comment.controller')
const { verifyToken } = require('../middleware/auth')

route.post('/:campaign_id/create',verifyToken,CommentController.create);
route.get('/:campaign_id',CommentController.list)

module.exports=route;