import { Router } from "express";
import { signup, login, logout } from "../controller/userController";
import verifyToken from "../middleware/auth-middleware";

const router = Router();

router.post("/", signup);
router.post("/login", login);
router.get("/logout", logout);

export default router;
