const userRouter = require("express").Router();
const userController = require("../controllers/userController");

userRouter.get("/", userController.gethome);
userRouter.get("/user/logout", userController.getlogout);
userRouter.get("/user/assigned-technician-details/:id",userController.getAssignedTechnicianDetails);

module.exports = userRouter;