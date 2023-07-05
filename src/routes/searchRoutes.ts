import { Router } from "express";
import { search } from "../controller/searchController";
import verifyToken from "../middleware/auth-middleware";

const router = Router();

router.get("/:key", verifyToken, search);

export default router;
