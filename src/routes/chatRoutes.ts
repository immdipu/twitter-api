import { Router } from "express";
import { AccesscreateChat } from "../controller/chatController";
import verifyToken from "../middleware/auth-middleware";

const router = Router();

router.post("/", verifyToken, AccesscreateChat);

export default router;
