import { Router } from "express";
import {
  getSingleUser,
  updateFollow,
  getAllFollowers,
} from "./../controller/profileController";
import verifyToken from "../middleware/auth-middleware";

const router = Router();

router.get("/:username", verifyToken, getSingleUser);
router.put("/:id/follow", verifyToken, updateFollow);
router.get("/:username/followers", verifyToken, getAllFollowers);

export default router;
