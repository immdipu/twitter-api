import { Document, Types } from "mongoose";

export interface userSchemaTypes extends Document {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  profilePic: string;
  likes?: Types.ObjectId[];
  retweetPost?: Types.ObjectId[];
  following?: Types.ObjectId[];
  followers?: Types.ObjectId[];
}
