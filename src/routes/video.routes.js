import { Router } from "express";
import {
  publishVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  updateVideoThumbnail,
  deleteVideo,
  togglePublishStatus
} from "../controllers/video.controllers.js";
import { authenticate } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

// Public routes
router.route("/").get(getAllVideos);
router.route("/:videoId").get(getVideoById);

// Protected routes
router.route("/").post(
  authenticate,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
  ]),
  publishVideo
);

router.route("/:videoId").patch(authenticate, updateVideo);
router.route("/:videoId").delete(authenticate, deleteVideo);
router.route("/thumbnail/:videoId").patch(
  authenticate,
  upload.single("thumbnail"),
  updateVideoThumbnail
);
router.route("/toggle/publish/:videoId").patch(authenticate, togglePublishStatus);

export default router;
