import { Router } from "express";
import { validateSignIn, validateSignUp } from "../middlewares/authMiddleware.js";
import { signIn, signUp } from "../controllers/authController.js";

const router = Router();

router.post('/sign-up', validateSignUp, signUp)
router.post('/sign-in', validateSignIn, signIn)

export default router;