import { Document, Schema, Types } from "mongoose";

export interface PostSchemaTypes extends Document {
  content: string;
  postedBy: Types.ObjectId;
  pinned?: boolean;
  likes?: Schema.Types.ObjectId[];
  retweetUsers?: Schema.Types.ObjectId[];
  retweetData?: Schema.Types.ObjectId;
  replyTo?: Schema.Types.ObjectId[];
}
