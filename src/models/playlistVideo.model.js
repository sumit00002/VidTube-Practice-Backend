/*
      id string PK,
  playlist_id string FK,
  video_id string FK,
  position int,
  added_at datetime,
*/


import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const playlistVideoSchema = new Schema(
  {
    playlist: {
      type: Schema.Types.ObjectId,
      ref: "Playlist",
      required: true,
      index: true,
    },

    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: true,
      index: true,
    },

    position: {
      type: Number,
      default: 1,
      min: 1,
    },

    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent same video being added twice in the same playlist
playlistVideoSchema.index(
  { playlist: 1, video: 1 },
  { unique: true }
);

// Useful query index
playlistVideoSchema.index({ playlist: 1, position: 1 });
playlistVideoSchema.plugin(mongooseAggregatePaginate);

export const PlaylistVideo = mongoose.model("PlaylistVideo", playlistVideoSchema);
