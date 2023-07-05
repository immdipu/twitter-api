import { Router } from "express";
import {
  AccesscreateChat,
  singleUserChats,
} from "../controller/chatController";
import verifyToken from "../middleware/auth-middleware";

const router = Router();

router.post("/", verifyToken, AccesscreateChat);
router.get("/allchats", verifyToken, singleUserChats);

export default router;
