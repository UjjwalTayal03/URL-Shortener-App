import express from "express"
import { createShortUrl, redirectUrl, getStats } from "../controllers/UrlController.js"

const router = express.Router()

router.post("/shorten", createShortUrl)
router.get("/stats/:code", getStats)
router.get("/:code", redirectUrl)

export default router