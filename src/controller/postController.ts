import Post from "../modal/PostSchema";
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import AsyncHandler from "express-async-handler";
import User from "../modal/UserSchema";
import { IRequest } from "../middleware/auth-middleware";

const postTweet = AsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.userId);
    if (user) {
      res.status(200);
      res.json(user);
    }
  }
);

export { postTweet };
