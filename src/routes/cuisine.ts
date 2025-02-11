import express from "express";
import { cuisineController } from "../controllers/cuisine.js";

const router = express.Router();
router.get("*", cuisineController.proxyAPI);

export { router as cuisineRouter };
