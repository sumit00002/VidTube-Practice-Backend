import { Router } from "express";
import {
  addComment,
  getVideoComments,
  updateComment,
  deleteComment,
  getUserComments,
  getCommentById
} from "../controllers/comment.controllers.js";
import { authenticate } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/video/:videoId").post(authenticate, addComment);
router.route("/video/:videoId").get(getVideoComments);
router.route("/:commentId").get(getCommentById);
router.route("/:commentId").patch(authenticate, updateComment);
router.route("/:commentId").delete(authenticate, deleteComment);
router.route("/user/:userId").get(getUserComments);

export default router;
