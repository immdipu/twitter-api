import { Document, Schema, Types } from "mongoose";

export interface chatTypes extends Document {
  chatName: string;
  isGroupChat: boolean;
  users: Schema.Types.ObjectId;
  lastestMessage: Schema.Types.ObjectId;
}
