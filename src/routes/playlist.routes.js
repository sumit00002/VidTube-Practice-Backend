import { Router } from "express";
import {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  updatePlaylist,
  deletePlaylist
} from "../controllers/playlist.controllers.js";
import { authenticate } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/").post(authenticate, createPlaylist);
router.route("/user/:userId").get(getUserPlaylists);
router.route("/:playlistId").get(getPlaylistById);
router.route("/:playlistId").patch(authenticate, updatePlaylist);
router.route("/:playlistId").delete(authenticate, deletePlaylist);
router.route("/add/:playlistId/:videoId").patch(authenticate, addVideoToPlaylist);
router.route("/remove/:playlistId/:videoId").patch(authenticate, removeVideoFromPlaylist);

export default router;
