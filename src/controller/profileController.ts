import mongoose, { Schema } from "mongoose";
import { Response, NextFunction } from "express";
import User from "../modal/UserSchema";
import AsyncHandler from "express-async-handler";
import { IRequest } from "../middleware/auth-middleware";

const getSingleUser = AsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const username = req.params.username;
    const myId = req.userId;
    const user = await User.findOne({ username: username });
    if (!username) {
      res.status(404);
      throw new Error("user not found");
    }
    res.status(200).json(user);
  }
);

const updateFollow = AsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const userId: unknown = req.params.id;
    const myuserId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404);
      throw new Error("User doesn't exit");
    }
    const selfUser = await User.findById(myuserId);

    const alreadyFollow = selfUser?.following?.includes(
      userId as Schema.Types.ObjectId
    );
    const option = alreadyFollow ? "$pull" : "$addToSet";

    const updatedFollow = await User.findByIdAndUpdate(
      myuserId,
      { [option]: { following: userId } },
      { new: true }
    );
    await User.findByIdAndUpdate(userId, { [option]: { followers: myuserId } });
    res.status(200).json(updatedFollow);
  }
);

const getAllFollowers = AsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const username = req.params.username;
    const user = await User.findOne({ username })
      .populate([
        { path: "followers", select: "firstName lastName username profilePic" },
        { path: "following", select: "firstName lastName username profilePic" },
      ])
      .select("fistName lastName username profilepic followers following");

    if (!user) {
      res.status(404);
      throw new Error("user not found");
    }
    res.status(200).json(user);
  }
);

export { getSingleUser, updateFollow, getAllFollowers };
