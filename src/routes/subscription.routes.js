import { Router } from "express";
import {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels
} from "../controllers/subscription.controllers.js";
import { authenticate } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/toggle/:channelId").post(authenticate, toggleSubscription);
router.route("/subscribers/:channelId").get(getUserChannelSubscribers);
router.route("/subscribed/:subscriberId").get(getSubscribedChannels);

export default router;
