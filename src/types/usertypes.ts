import { Document } from "mongoose";

export interface userSchema extends Document {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  profilePic: string;
}
