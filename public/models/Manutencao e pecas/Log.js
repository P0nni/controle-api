"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logSchema = new mongoose_1.default.Schema({
    action: String,
    documentId: mongoose_1.default.Schema.Types.ObjectId,
    collectionName: String,
    before: Object,
    after: Object,
    modifiedAt: { type: Date, default: Date.now },
    modifiedBy: Object, // Se você tiver autenticação, para registrar quem fez a modificação
});
exports.default = mongoose_1.default.model("Log", logSchema);
