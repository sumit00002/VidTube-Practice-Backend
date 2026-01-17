import asyncHandler from "../utils/asyncHandler.js";
import { Subscription } from "../models/subscription.models.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

// Toggle subscription
const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  if (channelId === req.user._id.toString()) {
    throw new ApiError(400, "You cannot subscribe to your own channel");
  }

  const existingSubscription = await Subscription.findOne({
    subscriber: req.user._id,
    channel: channelId
  });

  if (existingSubscription) {
    await Subscription.findByIdAndDelete(existingSubscription._id);
    return res
      .status(200)
      .json(new ApiResponse(200, { subscribed: false }, "Unsubscribed successfully"));
  }

  const subscription = await Subscription.create({
    subscriber: req.user._id,
    channel: channelId
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { subscribed: true }, "Subscribed successfully"));
});

// Get user's channel subscribers
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const subscribers = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId)
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriber",
        pipeline: [
          {
            $project: {
              username: 1,
              avatarUrl: 1,
              email: 1
            }
          }
        ]
      }
    },
    {
      $addFields: {
        subscriber: { $first: "$subscriber" }
      }
    },
    { $sort: { createdAt: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: parseInt(limit) }
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, subscribers, "Subscribers fetched successfully"));
});

// Get channels subscribed to by user
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!mongoose.Types.ObjectId.isValid(subscriberId)) {
    throw new ApiError(400, "Invalid subscriber ID");
  }

  const subscriptions = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId)
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channel",
        pipeline: [
          {
            $lookup: {
              from: "subscriptions",
              localField: "_id",
              foreignField: "channel",
              as: "subscribers"
            }
          },
          {
            $addFields: {
              subscribersCount: { $size: "$subscribers" }
            }
          },
          {
            $project: {
              username: 1,
              avatarUrl: 1,
              subscribersCount: 1
            }
          }
        ]
      }
    },
    {
      $addFields: {
        channel: { $first: "$channel" }
      }
    },
    { $sort: { createdAt: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: parseInt(limit) }
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, subscriptions, "Subscribed channels fetched successfully"));
});

export {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels
};