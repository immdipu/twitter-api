import { Document, Types } from "mongoose";

export interface PostSchemaTypes extends Document {
  content: string;
  postedBy: Types.ObjectId;
  pinned?: boolean;
  likes?: Types.ObjectId[];
  retweetUsers?: Types.ObjectId[];
  replyTo?: Types.ObjectId[];
}
