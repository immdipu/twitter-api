import {
  postTweet,
  getAllTweets,
  LikeTweet,
  reTweet,
  getSingleTweet,
  replyToTweet,
  deleteTweet,
  pinPost,
} from "../controller/postController";
import { Router } from "express";
import verifyToken from "../middleware/auth-middleware";

const router = Router();

router.post("/", verifyToken, postTweet);
router.get("/", verifyToken, getAllTweets);
router.delete("/:id", verifyToken, deleteTweet);
router.put("/:id/like", verifyToken, LikeTweet);
router.post("/:id/retweet", verifyToken, reTweet);
router.post("/reply", verifyToken, replyToTweet);
router.put("/:id", verifyToken, pinPost);
router.get("/:id", verifyToken, getSingleTweet);

export default router;
