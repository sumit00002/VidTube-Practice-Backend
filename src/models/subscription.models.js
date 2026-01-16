/*
  id string PK,
  subscriber_id string FK,
  channel_user_id string FK,
  created_at datetime,
*/

import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    channelUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate subscriptions
subscriptionSchema.index(
  { subscriber: 1, channelUser: 1 },
  { unique: true }
);

// Prevent self-subscription
subscriptionSchema.pre("save", function (next) {
  if (this.subscriber.toString() === this.channelUser.toString()) {
    return next(new Error("User cannot subscribe to themselves"));
  }
  next();
});

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
