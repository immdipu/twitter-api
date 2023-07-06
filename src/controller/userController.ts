import AsyncHandler from "express-async-handler";
import { NextFunction, Request, Response, response } from "express";
import mongoose, { Schema } from "mongoose";
import User from "../modal/UserSchema";
import { userSchemaTypes } from "../types/usertypes";
import jwt from "jsonwebtoken";
import { request } from "http";

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

const login = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password }: userSchemaTypes = req.body;
    if (!username && !email) {
      res.status(400);
      throw new Error("username or email is missing");
    }
    if (!password) {
      res.status(400);
      throw new Error("Password is missing");
    }
    const user = await User.findOne({ $or: [{ username }, { email }] }).select(
      "+password"
    );
    if (!user) {
      res.status(400);
      throw new Error("No user found, check username or email");
    }
    if (password !== user.password) {
      res.status(400);
      throw new Error("password is wrong");
    }
    res.status(200).json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      token: jwtToken(user._id),
      profilePic: user.profilePic,
    });
  }
);

const Autologin = AsyncHandler(async (req: Request, res: Response, next) => {
  const auth = req.headers["authorization"];
  const token = auth?.split(" ")[1];
  if (!token) {
    res.status(401);
    throw new Error("Unauthorized, No token found");
  }
  const decode = jwt.verify(token, process.env.JWT_SECRET!) as {
    id: Schema.Types.ObjectId;
  };
  const user: userSchemaTypes | null = await User.findById(decode.id).select(
    "firstName lastName email username createdAt profilePic"
  );
  if (!user) {
    res.status(400);
    throw new Error("User doesn't exist");
  }
  res.status(200).json(user);
});

const logout = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export { signup, login, logout, Autologin };
