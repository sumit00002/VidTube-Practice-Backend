import { Router } from "express";
import registerUser, {
  loginUser,
  refreshAccessToken,
  logoutUser,
  changePassword,
  getCurrentUser,
  updateProfile,
  updateUserCoverImage,
  updateUserAvatar,
  getUserChannelProfile,
  getWatchHistory,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { authenticate } from "../middlewares/auth.middlewares.js";

const router = Router();

// Public routes
router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  registerUser
);

router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);

// Protected routes
router.route("/logout").post(authenticate, logoutUser);
router.route("/change-password").post(authenticate, changePassword);
router.route("/current-user").get(authenticate, getCurrentUser);
router.route("/update-profile").patch(authenticate, updateProfile);
router
  .route("/avatar")
  .patch(authenticate, upload.single("avatar"), updateUserAvatar);
router
  .route("/cover-image")
  .patch(authenticate, upload.single("coverImage"), updateUserCoverImage);
router.route("/channel/:username").get(authenticate, getUserChannelProfile);
router.route("/watch-history").get(authenticate, getWatchHistory);

export default router;
