const express = require('express');
const { isCreator, verifyToken } = require('../middleware/auth');
const CampaignController= require('../controllers/campaign.controller');
const upload = require('../middleware/upload');
const route = express.Router();


route.post('/create',upload.single('image'),verifyToken,isCreator,CampaignController.createCampaign);
route.get('/all',CampaignController.getAllCampaigns);
route.get('/:id',CampaignController.getCampaignsbyid);
route.put("/:campaign_id",upload.any('image'),verifyToken,CampaignController.updateCampaign);
route.delete("/:campaign_id",verifyToken,isCreator,CampaignController.deleteCampaign);
route.put("/:campaign_id/updateEtat",verifyToken,CampaignController.updateCampaignEtat);
// route.get("/status",CampaignController.getCampaignsByStatus)

module.exports=route;