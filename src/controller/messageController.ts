import AsyncHandler from "express-async-handler";
import Chat from "../modal/ChatSchema";
import User from "../modal/UserSchema";
import Message from "../modal/MessageSchema";
import { IRequest } from "../middleware/auth-middleware";
import { Request, Response, NextFunction } from "express";

const sendMessage = AsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const { chatId, content } = req.body;
    if (!chatId || !content) {
      res.status(400);
      throw new Error("some field are missing");
    }
    let msg = await Message.create({
      content,
      sender: req.userId,
      chat: chatId,
    });
    msg = await msg?.populate([
      { path: "sender", select: "firstName lastName userame profilePic" },
      {
        path: "chat",
        populate: {
          path: "users",
          select: "firstName lastName userame profilePic",
        },
      },
    ]);

    await Chat.findByIdAndUpdate(chatId, { lastestMessage: msg });

    res.status(400).json(msg);
  }
);

const getAllMessage = AsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const chatId = req.params.id;
    console.log(chatId);
    const messages = await Message.find({ chat: chatId }).populate([
      {
        path: "sender",
        select: "firstName lastName userame profilePic",
      },
      { path: "chat" },
    ]);
    res.status(400).json(messages);
  }
);

export { sendMessage, getAllMessage };
