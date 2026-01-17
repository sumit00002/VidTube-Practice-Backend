import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  getCurrentUser,
  updateProfile,
  updateUserCoverImage,
  updateUserAvatar,
  getUserChannelProfile,
  getWatchHistory
} from "../controllers/user.controllers.js";
import { authenticate } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

// Public routes
router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  registerUser
);
router.route("/login").post(loginUser);

// Protected routes
router.route("/logout").post(authenticate, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(authenticate, changePassword);
router.route("/current-user").get(authenticate, getCurrentUser);
router.route("/update-profile").patch(authenticate, updateProfile);
router.route("/update-avatar").patch(
  authenticate,
  upload.single("avatar"),
  updateUserAvatar
);
router.route("/update-cover").patch(
  authenticate,
  upload.single("coverImage"),
  updateUserCoverImage
);
router.route("/channel/:username").get(getUserChannelProfile);
router.route("/history").get(authenticate, getWatchHistory);

export default router;