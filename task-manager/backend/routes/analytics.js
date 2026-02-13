import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getOverview, getTrends } from "../controllers/analyticsController.js";

const router = express.Router();

router.use(protect);
router.get("/overview", getOverview);
router.get("/trends", getTrends);

export default router;
