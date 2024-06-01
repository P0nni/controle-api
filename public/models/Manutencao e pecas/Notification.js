"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const notificationSchema = new mongoose_1.Schema({
    userId: mongoose_2.default.Schema.Types.ObjectId,
    title: String,
    message: String,
    link: String,
    viewed: Boolean,
    createdAt: { type: Date, default: Date.now },
});
exports.default = mongoose_2.default.model("Notification", notificationSchema);
