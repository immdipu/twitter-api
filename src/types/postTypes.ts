import { Document, Schema, Types } from "mongoose";

export interface PostSchemaTypes extends Document {
  content: string;
  postedBy: Schema.Types.ObjectId;
  pinned?: boolean;
  type: "tweet" | "reply" | "reweet";
  likes?: Schema.Types.ObjectId[];
  retweetUsers?: Schema.Types.ObjectId[];
  retweetData?: Schema.Types.ObjectId;
  replyTo?: Schema.Types.ObjectId[];
}
