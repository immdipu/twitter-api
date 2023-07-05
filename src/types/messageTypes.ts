import { Document, Schema } from "mongoose";

export interface messageTypes extends Document {
  sender: Schema.Types.ObjectId;
  content: string;
  chat: Schema.Types.ObjectId;
  readBy: Schema.Types.ObjectId;
}
