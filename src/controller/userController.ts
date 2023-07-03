import AsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import User from "../modal/UserSchema";
import { userSchemaTypes } from "../types/usertypes";
import jwt from "jsonwebtoken";

const jwtToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN!,
  });
};

const signup = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      username,
      password,
      firstName,
      lastName,
      email,
      profilePic,
    }: userSchemaTypes = req.body;

    if (!username || !password || !firstName || !lastName || !email) {
      res.status(400);
      throw new Error("Please enter all the fields");
    }

    const user = await User.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }],
    });
    if (user) {
      res.status(400);
      throw new Error("User already Exist");
    }

    const newUser = await User.create({
      firstName: req.body.firstName.trim(),
      lastName: req.body.lastName.trim(),
      username: req.body.username.trim(),
      password: req.body.password,
      email: req.body.email,
      profilePic: profilePic,
    });

    if (newUser) {
      res.status(200).json({
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        profilePic: newUser.profilePic,
        username: newUser.username,
        token: jwtToken(newUser._id),
      });
    }
  }
);

export { signup };
