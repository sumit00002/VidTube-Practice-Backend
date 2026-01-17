import { Router } from "express";
import {
  toggleVideoLike,
  toggleCommentLike,
  toggleTweetLike,
  getLikedVideos,
  getVideoLikesCount,
  getCommentLikesCount,
  getTweetLikesCount
} from "../controllers/like.controllers.js";
import { authenticate } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/toggle/video/:videoId").post(authenticate, toggleVideoLike);
router.route("/toggle/comment/:commentId").post(authenticate, toggleCommentLike);
router.route("/toggle/tweet/:tweetId").post(authenticate, toggleTweetLike);
router.route("/videos").get(authenticate, getLikedVideos);
router.route("/count/video/:videoId").get(getVideoLikesCount);
router.route("/count/comment/:commentId").get(getCommentLikesCount);
router.route("/count/tweet/:tweetId").get(getTweetLikesCount);

export default router;
