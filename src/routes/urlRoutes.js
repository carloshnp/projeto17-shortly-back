import { Router } from "express";
import {
  deleteShortenedUrl,
  getShortenedUrl,
  redirectToShortenedUrl,
  shortenUrl,
} from "../controllers/urlController.js";
import {
  shortenedUrlExists,
  updateVisitCount,
  validateShortenedUrl,
  validateToken,
  validateUrl,
} from "../middlewares/urlMiddleware.js";

const router = Router();

router.post("/urls/shorten", validateToken, validateUrl, shortenUrl);
router.get("/urls/:id", shortenedUrlExists, getShortenedUrl);
router.get("/urls/open/:shortUrl", validateShortenedUrl, updateVisitCount, redirectToShortenedUrl);
router.delete('/urls/:id', validateToken, validateShortenedUrl, deleteShortenedUrl)

export default router;
