const authRouter = require("express").Router();
const authController = require("../controllers/authController");

authRouter.get("/user/login", authController.login);
authRouter.get("/user/signIn", authController.signIn);
authRouter.post("/user/register", authController.registerUser);
authRouter.post("/user/login", authController.postLogin);

module.exports = authRouter;