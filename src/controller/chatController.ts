import { IRequest } from "../middleware/auth-middleware";
import { Schema } from "mongoose";
import { Response, NextFunction } from "express";
import Chat from "../modal/ChatSchema";
import User from "../modal/UserSchema";
import AsyncHandler from "express-async-handler";

const AccesscreateChat = AsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const secondUserId = req.body.secondUserId;
    if (!secondUserId) {
      res.status(400);
      throw new Error("Second user not found");
    }

    const isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: secondUserId } } },
        {
          users: { $elemMatch: { $eq: req.userId } },
        },
      ],
    }).populate({
      path: "users",
      select: "firstName lastName userame profilePic",
    });
    if (isChat.length > 0) {
      res.status(200).json(isChat[0]);
    } else {
      const chat = await Chat.create({
        chatName: "Sender",
        isGroupChat: false,
        users: [req.userId, secondUserId],
      });
      res.status(200).json(chat);
    }
  }
);

const singleUserChats = AsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: userId } },
    })
      .populate([
        {
          path: "lastestMessage",
          populate: {
            path: "sender",
            select: "firstName lastName userame profilePic",
          },
        },
        { path: "users", select: "firstName lastName userame profilePic" },
      ])
      .sort({ updatedAt: -1 });
    res.status(200).json(chats);
  }
);

const createGroupChat = AsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const { chatName, users } = req.body;
    if (!chatName || !users) {
      res.status(401);
      throw new Error("some field are missing");
    }
    users.push(req.userId);
    const groupchat = await Chat.create({
      chatName,
      users,
      isGroupChat: true,
      groupAdmin: req.userId,
    });
    res.status(200).json(groupchat);
  }
);

export { AccesscreateChat, singleUserChats };
