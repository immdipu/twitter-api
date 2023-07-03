import Post from "../modal/PostSchema";
import mongoose, { Aggregate } from "mongoose";
import { Request, Response, NextFunction } from "express";
import AsyncHandler from "express-async-handler";
import User from "../modal/UserSchema";
import { PostSchemaTypes } from "../types/postTypes";
import { IRequest } from "../middleware/auth-middleware";

const postTweet = AsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const { content }: PostSchemaTypes = req.body;
    if (!content) {
      res.status(400);
      throw new Error("please write some tweet");
    }
    const post = await Post.create({
      content,
      postedBy: req.userId,
    });

    await post.populate({
      path: "postedBy",
      select: "_id firstName lastName profilePic",
    });
    res.status(200).json(post);
  }
);

const getAllTweets = AsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const tweets: Aggregate<any[]> = Post.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "postedBy",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                _id: 1,
                firstName: 1,
                lastName: 1,
                profilePic: 1,
                username: 1,
              },
            },
          ],
          as: "postedBy",
        },
      },
      {
        $addFields: {
          createdDate: {
            $dateToString: {
              date: "$createdAt",
              format: "%Y-%m-%d %H:%M:%S",
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          content: 1,
          likesCount: { $size: "$likes" },
          retweetCounts: { $size: "$retweetUsers" },
          createdDate: 1,
          postedBy: {
            $arrayElemAt: ["$postedBy", 0],
          },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    const populatedTweets = await tweets.exec();

    res.status(200).json(populatedTweets);
  }
);

export { postTweet, getAllTweets };
