import { Router } from "express";
import { registerController } from "../controllers/auth.control.js";

const router = Router();

router.route("/register").post(registerController);
router.route("/login").post(registerController);

export default router;
