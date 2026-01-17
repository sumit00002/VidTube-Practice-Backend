import asyncHandler from "../utils/asyncHandler.js";
import { Like } from "../models/like.models.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

// Toggle video like
const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const existingLike = await Like.findOne({
    video: videoId,
    likedBy: req.user._id
  });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    return res
      .status(200)
      .json(new ApiResponse(200, { isLiked: false }, "Video unliked successfully"));
  }

  const like = await Like.create({
    video: videoId,
    likedBy: req.user._id
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { isLiked: true }, "Video liked successfully"));
});

// Toggle comment like
const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, "Invalid comment ID");
  }

  const existingLike = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id
  });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    return res
      .status(200)
      .json(new ApiResponse(200, { isLiked: false }, "Comment unliked successfully"));
  }

  const like = await Like.create({
    comment: commentId,
    likedBy: req.user._id
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { isLiked: true }, "Comment liked successfully"));
});

// Toggle tweet like
const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const existingLike = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user._id
  });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    return res
      .status(200)
      .json(new ApiResponse(200, { isLiked: false }, "Tweet unliked successfully"));
  }

  const like = await Like.create({
    tweet: tweetId,
    likedBy: req.user._id
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { isLiked: true }, "Tweet liked successfully"));
});

// Get all liked videos
const getLikedVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(req.user._id),
        video: { $exists: true }
      }
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    username: 1,
                    avatarUrl: 1
                  }
                }
              ]
            }
          },
          {
            $addFields: {
              owner: { $first: "$owner" }
            }
          }
        ]
      }
    },
    {
      $addFields: {
        video: { $first: "$video" }
      }
    },
    {
      $project: {
        video: 1,
        createdAt: 1
      }
    },
    { $sort: { createdAt: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: parseInt(limit) }
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, likedVideos, "Liked videos fetched successfully"));
});

// Get video likes count
const getVideoLikesCount = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const likesCount = await Like.countDocuments({ video: videoId });

  const isLiked = await Like.exists({
    video: videoId,
    likedBy: req.user?._id
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { likesCount, isLiked: !!isLiked },
        "Video likes count fetched successfully"
      )
    );
});

// Get comment likes count
const getCommentLikesCount = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, "Invalid comment ID");
  }

  const likesCount = await Like.countDocuments({ comment: commentId });

  const isLiked = await Like.exists({
    comment: commentId,
    likedBy: req.user?._id
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { likesCount, isLiked: !!isLiked },
        "Comment likes count fetched successfully"
      )
    );
});

// Get tweet likes count
const getTweetLikesCount = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const likesCount = await Like.countDocuments({ tweet: tweetId });

  const isLiked = await Like.exists({
    tweet: tweetId,
    likedBy: req.user?._id
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { likesCount, isLiked: !!isLiked },
        "Tweet likes count fetched successfully"
      )
    );
});

export {
  toggleVideoLike,
  toggleCommentLike,
  toggleTweetLike,
  getLikedVideos,
  getVideoLikesCount,
  getCommentLikesCount,
  getTweetLikesCount
};