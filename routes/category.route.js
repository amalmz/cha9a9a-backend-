const express = require('express')
const route = express.Router()
const CategoryController  = require('../controllers/category.controller')
const { verifyToken, isAdmin } = require('../middleware/auth');

route.post('/create',verifyToken ,isAdmin,CategoryController.createcategory); 
route.put('/:id',verifyToken ,isAdmin,CategoryController.updatecategory);
route.delete('/:id', verifyToken ,isAdmin,CategoryController.deletecategory);
route.get('/:id',CategoryController.getcategorybyid);
route.get('/',CategoryController.getallcategories);



module.exports = route ;  