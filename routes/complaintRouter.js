const express = require("express");
const complaintRouter = express.Router();
const complaintController = require("../controllers/complaintController");

complaintRouter.get("/complaints", complaintController.getComplaints);
complaintRouter.post("/complaints", complaintController.postComplaints); 
complaintRouter.get("/track",complaintController.getTrackComplaint); 

exports.complaintRouter = complaintRouter;