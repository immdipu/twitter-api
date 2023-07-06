import { Router } from "express";
import { signup, login, logout, Autologin } from "../controller/userController";

const router = Router();

router.post("/", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/", Autologin);

export default router;
