import { Router } from "express";
import {
  createTweet,
  getUserTweets,
  getAllTweets,
  updateTweet,
  deleteTweet
} from "../controllers/tweet.controllers.js";
import { authenticate } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/").get(getAllTweets);
router.route("/").post(authenticate, createTweet);
router.route("/user/:userId").get(getUserTweets);
router.route("/:tweetId").patch(authenticate, updateTweet);
router.route("/:tweetId").delete(authenticate, deleteTweet);

export default router;
