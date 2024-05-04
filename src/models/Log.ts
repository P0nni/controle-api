import { IToken } from "./User";

const mongoose = require("mongoose");

export interface ILog {
  action: string;
  documentId: import("mongoose").Types.ObjectId;
  collectionName: string;
  before: Record<string, any>;
  after: Record<string, any>;
  modifiedAt?: Date;
  modifiedBy?: IToken;
}

const logSchema = new mongoose.Schema({
  action: String,
  documentId: mongoose.Schema.Types.ObjectId,
  collectionName: String,
  before: Object,
  after: Object,
  modifiedAt: { type: Date, default: Date.now },
  modifiedBy: Object, // Se você tiver autenticação, para registrar quem fez a modificação
});

export default mongoose.model("Log", logSchema);
