import mongoose, { Schema, model } from "mongoose";
import { chatTypes } from "../types/chatTypes";

const chatSchema = new Schema<chatTypes>(
  {
    chatName: {
      type: String,
      trim: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastestMessage: { type: Schema.Types.ObjectId, ref: "Message" },
    groupAdmin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Chat = model<chatTypes>("Chat", chatSchema);

export default Chat;
