import { IRequest } from "../middleware/auth-middleware";
import { Schema } from "mongoose";
import { Response, NextFunction } from "express";
import Chat from "../modal/ChatSchema";
import User from "../modal/UserSchema";
import AsyncHandler from "express-async-handler";

const AccesscreateChat = AsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const secondUserId = req.body;
    if (!secondUserId) {
      res.status(400);
      throw new Error("Second user not found");
    }
    const isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: secondUserId } } },
        { users: { $elemMatch: { $eq: req.userId } } },
      ],
    });
    res.status(200).json(isChat);
  }
);

export { AccesscreateChat };
