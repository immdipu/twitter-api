import { postTweet } from "../controller/postController";
import { Router } from "express";
import verifyToken from "../middleware/auth-middleware";

const router = Router();

router.post("/", verifyToken, postTweet);

export default router;
