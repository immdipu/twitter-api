import { postTweet, getAllTweets } from "../controller/postController";
import { Router } from "express";
import verifyToken from "../middleware/auth-middleware";

const router = Router();

router.post("/", verifyToken, postTweet);
router.get("/", verifyToken, getAllTweets);

export default router;
