import { Router } from "express";
import { validateSignUp } from "../middlewares/authMiddleware.js";
import { signUp } from "../controllers/authController.js";

const router = Router();

router.post('/sign-up', validateSignUp, signUp)
router.post('/sign-in')

export default router;