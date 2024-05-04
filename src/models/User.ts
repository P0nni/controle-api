import mongoose, { Document } from "mongoose";
import { ObjectId } from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  authLevel:{
    type: Number,
    require:true,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  
});

export interface IToken{
  userId : string,
  name: string,
  authLevel? : number
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  authLevel: number;
  createdAt: Date;
}

export default mongoose.model<IUser>("User", userSchema);
