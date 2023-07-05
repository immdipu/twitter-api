import { messageTypes } from "../types/messageTypes";
import { Schema, model } from "mongoose";

const MessageSchema = new Schema<messageTypes>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);
const Message = model<messageTypes>("Message", MessageSchema);

export default Message;
