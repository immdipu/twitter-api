import { Schema, Types, model } from "mongoose";
import { PostSchemaTypes } from "../types/postTypes";

const PostSchema = new Schema<PostSchemaTypes>(
  {
    content: {
      type: String,
      trim: true,
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    pinned: {
      type: Boolean,
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    retweetUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    retweetData: { type: Schema.Types.ObjectId, ref: "Post" },
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  {
    timestamps: true,
  }
);

const Post = model<PostSchemaTypes>("Post", PostSchema);

export default Post;
