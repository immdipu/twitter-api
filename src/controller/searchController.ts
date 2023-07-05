import { IRequest } from "../middleware/auth-middleware";
import { Response, NextFunction } from "express";
import AsyncHandler from "express-async-handler";
import Post from "../modal/PostSchema";
import User from "../modal/UserSchema";
import { Aggregate } from "mongoose";

const search = AsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const serachTerm = req.params.key;
    const posts: Aggregate<any[]> = Post.aggregate([
      {
        $match: {
          $or: [{ content: { $regex: serachTerm } }],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "postedBy",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                firstName: 1,
                lastName: 1,
                username: 1,
                profilePic: 1,
              },
            },
          ],
          as: "postedBy",
        },
      },
      {
        $addFields: {
          createdAt: {
            $dateToString: {
              date: "$createdAt",
              format: "%Y-%m-%d %H:%M:%S",
            },
          },
        },
      },
      {
        $project: {
          content: 1,
          postedBy: { $arrayElemAt: ["$postedBy", 0] },
          likes: { $size: "$likes" },
          retweets: { $size: "$retweetUsers" },
          createdAt: 1,
        },
      },
    ]);

    const populatedPosts = await posts.exec();

    const users = await User.find({
      $or: [
        { firstName: { $regex: serachTerm } },
        { lastName: { $regex: serachTerm } },
        { username: { $regex: serachTerm } },
      ],
    }).select("firstName lastName username profilePic");
    if (!posts) {
      res.status(400);
      throw new Error("Tweet not found");
    }
    res.status(200).json({
      Tweets: populatedPosts,
      users,
    });
  }
);

export { search };
