/*
 id string PK,
  video_id string FK,
  user_id string FK,
  parent_comment_id string FK,
  content string,
  is_edited boolean,
  created_at datetime,
  updated_at datetime,
*/ 


import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const commentSchema = new Schema(
  {
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: true,
      index: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null, //null => top-level comment
      index: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 2000,
    },

    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, //createdAt + updatedAt
  }
);

// helpful indexes
commentSchema.index({ video: 1, createdAt: -1 });
commentSchema.index({ parentComment: 1, createdAt: 1 });
commentSchema.plugin(mongooseAggregatePaginate);
export const Comment = mongoose.model("Comment", commentSchema);
