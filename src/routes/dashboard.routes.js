import { Router } from "express";
import {
  getChannelStats,
  getChannelVideos,
  getChannelAnalytics,
  getVideoPerformance,
  getRevenueSummary
} from "../controllers/dashboard.controllers.js";
import { authenticate } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/stats").get(authenticate, getChannelStats);
router.route("/videos").get(authenticate, getChannelVideos);
router.route("/analytics").get(authenticate, getChannelAnalytics);
router.route("/video/:videoId").get(authenticate, getVideoPerformance);
router.route("/revenue").get(authenticate, getRevenueSummary);

export default router;
