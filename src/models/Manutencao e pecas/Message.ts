import { IToken } from "./User";
import mongoose from "mongoose";

export interface IMessage {
  message: string;
  documentId: import("mongoose").Types.ObjectId;
  createdAt?: Date;
  author?: IToken;
}

const msgSchema = new mongoose.Schema({
  message: String,
  documentId: mongoose.Schema.Types.ObjectId,
  createdAt: { type: Date, default: Date.now },
  author: Object, // Se você tiver autenticação, para registrar quem fez a modificação
});

export default mongoose.model("Message", msgSchema);
