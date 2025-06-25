const adminRouter = require("express").Router();
const adminController = require("../controllers/adminController");
const admin = require("../models/admin");

adminRouter.get("/admin/login", adminController.getlogin);
adminRouter.get("/admin/dashboard", adminController.getdashboard);
adminRouter.post("/admin/login", adminController.postlogin);
adminRouter.post("/admin/update-status/:id", adminController.postUpdateStatus);
adminRouter.get("/admin/details/:id", adminController.getDetails);
adminRouter.post("/admin/complaint/:id/assign", adminController.postAssignTechnician);
adminRouter.get("/admin/add-technician",adminController.addTechnician);
adminRouter.post("/admin/technicians/add",adminController.postAddTechnician);

exports.adminRouter = adminRouter;