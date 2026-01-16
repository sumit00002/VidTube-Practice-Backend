/*
id string PK,
  user_id string FK,
  target_type string,  
  target_id string,
  created_at datetime,
*/ 

import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    targetType: {
      type: String,
      required: true,
      enum: ["video", "comment", "tweet"],
      index: true,
    },

    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true, //createdAt + updatedAt
  }
);

// Prevent duplicate likes
// (same user cannot like same target more than once)
likeSchema.index(
  { user: 1, targetType: 1, targetId: 1 },
  { unique: true }
);

export const Like = mongoose.model("Like", likeSchema);
