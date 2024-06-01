import { Document, Schema } from 'mongoose';
import mongoose from "mongoose";

export interface INotification extends Document {
  userId: import("mongoose").Schema.Types.ObjectId;
  title: string;
  message: string;
  link: string;
  viewed: boolean;
  createdAt?: Date;
}

const notificationSchema = new Schema<INotification>({
  userId: mongoose.Schema.Types.ObjectId,
  title: String,
  message: String,
  link: String,
  viewed: Boolean,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<INotification>("Notification", notificationSchema);
