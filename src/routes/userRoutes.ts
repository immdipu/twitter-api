import { Router } from "express";
import { signup } from "../controller/userController";

const router = Router();

router.get("/", signup);

export default router;
