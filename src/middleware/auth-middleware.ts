import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AsyncHandler from "express-async-handler";
import User from "../modal/UserSchema";
import { Schema } from "mongoose";
import { userSchemaTypes } from "../types/usertypes";

export interface IRequest extends Request {
  userId?: Schema.Types.ObjectId;
}

const verifyToken = AsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401);
      throw new Error("Unauthorized, Token not found");
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401);
      throw new Error("Unauthorized, No token found");
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: Schema.Types.ObjectId;
    };
    const user: userSchemaTypes | null = await User.findById(decode.id);
    if (!user) {
      res.status(400);
      throw new Error("User doesn't exist");
    }
    if (user) {
      req.userId = decode.id;
      return next();
    }
    res.status(400);
    throw new Error("Unauthorized");
  }
);

export default verifyToken;
