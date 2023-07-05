import { IRequest } from "../middleware/auth-middleware";
import { Schema } from "mongoose";
import { Response, NextFunction } from "express";
import Chat from "../modal/ChatSchema";
import User from "../modal/UserSchema";
import AsyncHandler from "express-async-handler";

const createChat = AsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {}
);
