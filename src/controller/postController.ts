import Post from "../modal/PostSchema";
import mongoose, { Aggregate, ObjectId, Schema } from "mongoose";
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
      select: "_id firstName lastName profilePic username",
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
        $lookup: {
          from: "posts",
          localField: "replyTo",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                _id: 1,
                content: 1,
                postedBy: 1,
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
          ],
          as: "replyTo",
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
          _id: 1,
          content: 1,
          likes: { $size: "$likes" },
          retweets: { $size: "$retweetUsers" },
          createdAt: 1,
          postedBy: {
            $arrayElemAt: ["$postedBy", 0],
          },
          replyTo: {
            $arrayElemAt: ["$replyTo", 0],
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

const getSingleTweet = AsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const postId = req.params.id;
    const tweet = await Post.findById(postId).populate([
      {
        path: "likes",
        select: "firstName lastName username profilePic ",
      },
      {
        path: "postedBy",
        select: "firstName lastName username profilePic",
      },
      {
        path: "retweetUsers",
        select: "firstName lastName username profilePic",
      },
    ]);
    if (!tweet) {
      res.status(404);
      throw new Error("No tweet found");
    }
    res.status(200).json(tweet);
  }
);

const LikeTweet = AsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    let userId = req.userId;
    let postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      res.status(400);
      throw new Error("Tweet not found");
    }

    const isLiked = post.likes?.includes(userId!);
    const option = isLiked ? "$pull" : "$addToSet";

    await Post.findByIdAndUpdate(postId, {
      [option]: { likes: userId },
    });
    await User.findByIdAndUpdate(userId, {
      [option]: { likes: postId },
    });

    res.status(200).json({
      Like: !isLiked,
    });
  }
);

const reTweet = AsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const postId = req.params.id;
    let deletePost = await Post.findOneAndDelete({
      postedBy: userId,
      retweetData: { $exists: true, $eq: postId },
    });
    const option = deletePost == null ? "$addToSet" : "$pull";

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        [option]: { retweetUsers: userId },
      },
      { new: true }
    );

    await User.findByIdAndUpdate(
      userId,
      { [option]: { retweetPost: postId } },
      { new: true }
    );

    if (deletePost === null) {
      const retweet = await Post.create({
        postedBy: userId,
        retweetData: postId,
      });
      await retweet.populate({
        path: "retweetData",
        select: "content postedBy likes retweetUsers createdAt",
      });
      res.status(200).json(updatedPost);
    } else {
      res.status(200).json(updatedPost);
    }
  }
);

const replyToTweet = AsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const { content, replyTo } = req.body;
    if (!content || !replyTo) {
      res.status(400);
      throw new Error("some field are missing");
    }
    const post = Post.findById(replyTo);
    if (!post) {
      res.status(404);
      throw new Error("Invalid Post");
    }
    const reply = await Post.create({
      content,
      replyTo,
      postedBy: req.userId,
    });
    await reply.populate([
      {
        path: "postedBy",
        select: "firstName lastName profilePic username",
      },
    ]);
    res.status(200).json(reply);
  }
);

const deleteTweet = AsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const postId = req.params.id;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404);
      throw new Error("Tweet not found");
    }

    if (post.postedBy.toString() !== userId!.toString()) {
      res.status(403);
      throw new Error("Unauthorized to delete this tweet");
    }

    await Post.findOneAndDelete({ _id: postId });
    res.status(200).json("Tweet deleted successfully");
  }
);

const pinPost = AsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const postId = req.params.id;
    await Post.updateMany({ postedBy: req.userId }, { pinned: false });
    const post = await Post.findOneAndUpdate(
      { _id: postId, postedBy: req.userId },
      { pinned: true },
      { new: true }
    );
    if (!post) {
      res.status(404);
      throw new Error("Tweet not found");
    }
    res.status(200).json("Tweet pinned successfully");
  }
);

export {
  postTweet,
  getAllTweets,
  LikeTweet,
  reTweet,
  getSingleTweet,
  replyToTweet,
  deleteTweet,
  pinPost,
};
