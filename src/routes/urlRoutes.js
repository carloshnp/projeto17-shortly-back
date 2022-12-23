import { Router } from "express";
import {
  getShortenedUrl,
  redirectToShortenedUrl,
  shortenUrl,
} from "../controllers/urlController.js";
import {
  shortenedUrlExists,
  validateShortenedUrl,
  validateToken,
  validateUrl,
} from "../middlewares/urlMiddleware.js";

const router = Router();

router.post("/urls/shorten", validateToken, validateUrl, shortenUrl);
router.get("/urls/:id", shortenedUrlExists, getShortenedUrl);
router.get("/urls/open/:shortUrl", validateShortenedUrl, redirectToShortenedUrl);

export default router;
