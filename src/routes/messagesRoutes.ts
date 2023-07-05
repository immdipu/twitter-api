import { Router } from "express";
import { sendMessage, getAllMessage } from "../controller/messageController";
import verifyToken from "../middleware/auth-middleware";

const router = Router();

router.post("/", verifyToken, sendMessage);
router.get("/:id", verifyToken, getAllMessage);

export default router;
