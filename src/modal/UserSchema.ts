import { Schema, model } from "mongoose";
import { userSchemaTypes } from "../types/usertypes";

const UserSchema = new Schema<userSchemaTypes>(
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
      select: false,
    },
    profilePic: {
      type: String,
      default: "https://i5.extraimage.xyz/pix/2023/07/03/u6FQgX.jpg",
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    retweetPost: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

const User = model<userSchemaTypes>("User", UserSchema);

export default User;
