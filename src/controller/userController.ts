import AsyncHandler from "express-async-handler";
import { RequestHandler } from "express";
import mongoose from "mongoose";
import { userSchemaTypes } from "../types/usertypes";

const signup: RequestHandler = AsyncHandler(async (req, res, next) => {
  const {
    username,
    password,
    firstName,
    lastName,
    email,
    profilePic,
  }: userSchemaTypes = req.body;

  res.status(200).json("hello you are fired");
});

export { signup };
