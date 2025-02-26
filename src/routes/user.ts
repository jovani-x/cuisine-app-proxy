import express from "express";
import { userController } from "../controllers/user.js";
import { validateCredentials } from "../middlewares/loginValidation.js";

const router = express.Router();

// Login
router.post("/login", validateCredentials, userController.login);
// Logout
router.post("/logout", userController.logout);
// Check me (check user token)
router.get("/me", userController.me);

export { router as userRouter };
