"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class DataService {
    constructor() {
        this.mongoDB = mongoose_1.default;
    }
}
exports.DataService = DataService;
