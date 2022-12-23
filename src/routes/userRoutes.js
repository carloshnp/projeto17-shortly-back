import { Router } from "express";
import { getUserData } from "../controllers/userController.js";
import { validateToken } from "../middlewares/urlMiddleware.js";

const router = Router();

router.get("/users/me", validateToken, getUserData);

export default router;
