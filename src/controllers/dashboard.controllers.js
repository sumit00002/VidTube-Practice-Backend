import asyncHandler from "../utils/asyncHandler.js";
import { Video } from "../models/video.models.js";
import { Subscription } from "../models/subscription.models.js";
import { Like } from "../models/like.models.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

// Get channel statistics
const getChannelStats = asyncHandler(async (req, res) => {
  const channelId = req.user._id;

  // Get total videos count
  const totalVideos = await Video.countDocuments({
    owner: channelId
  });

  // Get total views and subscribers using aggregation
  const stats = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(channelId)
      }
    },
    {
      $group: {
        _id: null,
        totalViews: { $sum: "$views" },
        totalVideos: { $sum: 1 }
      }
    }
  ]);

  // Get total subscribers
  const totalSubscribers = await Subscription.countDocuments({
    channel: channelId
  });

  // Get total likes on all videos
  const videoIds = await Video.find({ owner: channelId }).select("_id");
  const videoIdArray = videoIds.map(video => video._id);

  const totalLikes = await Like.countDocuments({
    video: { $in: videoIdArray }
  });

  const channelStats = {
    totalVideos: stats[0]?.totalVideos || 0,
    totalViews: stats[0]?.totalViews || 0,
    totalSubscribers,
    totalLikes
  };

  return res
    .status(200)
    .json(new ApiResponse(200, channelStats, "Channel stats fetched successfully"));
});

// Get all channel videos
const getChannelVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sortBy = "createdAt", sortType = "desc" } = req.query;

  const sortStage = {};
  sortStage[sortBy] = sortType === "asc" ? 1 : -1;

  const videos = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(req.user._id)
      }
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes"
      }
    },
    {
      $addFields: {
        likesCount: { $size: "$likes" }
      }
    },
    {
      $project: {
        likes: 0
      }
    },
    { $sort: sortStage },
    { $skip: (page - 1) * limit },
    { $limit: parseInt(limit) }
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
});

// Get channel analytics (detailed breakdown)
const getChannelAnalytics = asyncHandler(async (req, res) => {
  const channelId = req.user._id;

  // Get monthly views breakdown
  const monthlyViews = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(channelId)
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        },
        totalViews: { $sum: "$views" },
        totalVideos: { $sum: 1 }
      }
    },
    {
      $sort: {
        "_id.year": -1,
        "_id.month": -1
      }
    },
    { $limit: 12 }
  ]);

  // Get top performing videos
  const topVideos = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(channelId)
      }
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes"
      }
    },
    {
      $addFields: {
        likesCount: { $size: "$likes" }
      }
    },
    {
      $project: {
        title: 1,
        views: 1,
        likesCount: 1,
        createdAt: 1,
        thumbnail: 1
      }
    },
    { $sort: { views: -1 } },
    { $limit: 10 }
  ]);

  // Get subscriber growth (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentSubscribers = await Subscription.countDocuments({
    channel: channelId,
    createdAt: { $gte: thirtyDaysAgo }
  });

  const analytics = {
    monthlyViews,
    topVideos,
    recentSubscribers
  };

  return res
    .status(200)
    .json(new ApiResponse(200, analytics, "Channel analytics fetched successfully"));
});

// Get video performance metrics
const getVideoPerformance = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to view this video's analytics");
  }

  const likesCount = await Like.countDocuments({ video: videoId });

  const performance = {
    videoId: video._id,
    title: video.title,
    views: video.views,
    likesCount,
    duration: video.duration,
    isPublished: video.isPublished,
    createdAt: video.createdAt,
    thumbnail: video.thumbnail
  };

  return res
    .status(200)
    .json(new ApiResponse(200, performance, "Video performance fetched successfully"));
});

// Get revenue/earnings summary (placeholder for monetization)
const getRevenueSummary = asyncHandler(async (req, res) => {
  const channelId = req.user._id;

  // Get total views for revenue calculation
  const stats = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(channelId)
      }
    },
    {
      $group: {
        _id: null,
        totalViews: { $sum: "$views" }
      }
    }
  ]);

  // Estimated revenue (example: $2 per 1000 views)
  const totalViews = stats[0]?.totalViews || 0;
  const estimatedRevenue = (totalViews / 1000) * 2;

  const revenueSummary = {
    totalViews,
    estimatedRevenue: estimatedRevenue.toFixed(2),
    currency: "USD"
  };

  return res
    .status(200)
    .json(new ApiResponse(200, revenueSummary, "Revenue summary fetched successfully"));
});

export {
  getChannelStats,
  getChannelVideos,
  getChannelAnalytics,
  getVideoPerformance,
  getRevenueSummary
};