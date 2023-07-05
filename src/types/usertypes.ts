import { Document, Schema, Types } from "mongoose";

export interface userSchemaTypes extends Document {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  profilePic?: string;
  likes?: Schema.Types.ObjectId[];
  retweetPost?: Schema.Types.ObjectId[];
  following?: Schema.Types.ObjectId[];
  followers?: Schema.Types.ObjectId[];
}
