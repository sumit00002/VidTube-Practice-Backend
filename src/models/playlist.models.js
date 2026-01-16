/*
id string PK,
  owner_id string FK,
  title string,
  description string,
  visibility string,  // public | private
  created_at datetime,
  updated_at datetime,
*/

import mongoose, { Schema } from "mongoose";

const playlistSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2000,
    },

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

playlistSchema.index({ owner: 1, createdAt: -1 });

export const Playlist = mongoose.model("Playlist", playlistSchema);
