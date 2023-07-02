import { Schema, model } from "mongoose";
import { userSchema } from "../types/usertypes";

const UserSchema = new Schema<userSchema>(
  {
    firstName: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "last name is required"],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "username is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    profilePic: { type: String },
  },
  {
    timestamps: true,
  }
);

const User = model<userSchema>("User", UserSchema);

module.exports = User;
