import { Document, Schema, Types } from "mongoose";

export interface PostSchemaTypes extends Document {
  content: string;
  postedBy: Types.ObjectId;
  pinned?: boolean;
  likes?: Schema.Types.ObjectId[];
  retweetUsers?: Types.ObjectId[];
  retweetData?: Schema.Types.ObjectId;
  replyTo?: Types.ObjectId[];
}
