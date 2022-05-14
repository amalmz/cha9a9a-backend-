const express = require('express')
const route = express.Router()
const CommentController = require('../controllers/comment.controller')
const { verifyToken } = require('../middleware/auth')

route.post('/:campaign_id/create',verifyToken,CommentController.createComment);
route.delete('/:campaign_id/:id',verifyToken,CommentController.deleteComment);
route.put('/:id',verifyToken,CommentController.updateComment);

module.exports=route;