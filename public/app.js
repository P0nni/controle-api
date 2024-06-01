"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const router_1 = require("./router");
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv").config();
class App {
    constructor() {
        this.MONGO_URI = process.env.MONGO_URI;
        this.server = (0, express_1.default)();
        this.middleware();
        this.router();
        mongoose_1.default.connect(this.MONGO_URI).then(() => {
            console.log("Connected to DB");
        });
    }
    middleware() {
        this.server.use(express_1.default.json());
    }
    router() {
        this.server.use(router_1.router);
    }
}
exports.App = App;
