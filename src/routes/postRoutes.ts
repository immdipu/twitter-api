import {
  postTweet,
  getAllTweets,
  LikeTweet,
  reTweet,
  getSingleTweet,
  replyToTweet,
} from "../controller/postController";
import { Router } from "express";
import verifyToken from "../middleware/auth-middleware";

const router = Router();

router.post("/", verifyToken, postTweet);
router.get("/", verifyToken, getAllTweets);
router.get("/:id", verifyToken, getSingleTweet);
router.put("/:id/like", verifyToken, LikeTweet);
router.post("/:id/retweet", verifyToken, reTweet);
router.post("/reply", verifyToken, replyToTweet);

export default router;
