import {
  postTweet,
  getAllTweets,
  LikeTweet,
  reTweet,
} from "../controller/postController";
import { Router } from "express";
import verifyToken from "../middleware/auth-middleware";

const router = Router();

router.post("/", verifyToken, postTweet);
router.get("/", verifyToken, getAllTweets);
router.put("/:id/like", verifyToken, LikeTweet);
router.post("/:id/retweet", verifyToken, reTweet);

export default router;
