const express = require('express')
const route = express.Router()
const DonationController  = require('../controllers/donation.controller');
const { verifyToken} = require('../middleware/auth');

route.post('/:campaign_id',verifyToken,DonationController.createdonation); 
route.put("/status",DonationController.Updatedonation)

module.exports = route ;  