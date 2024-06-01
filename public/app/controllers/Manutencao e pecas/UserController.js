"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const User_1 = __importDefault(require("../../../models/Manutencao e pecas/User"));
class UserController {
    async create(req, res) {
        const userBody = req.body;
        const createdUser = await User_1.default.create(userBody);
        return res.status(200).json({
            status: 200,
            response: createdUser,
        });
    }
    async all(req, res) {
        const users = await User_1.default.find();
        return res.status(201).json({
            status: 201,
            response: users,
        });
    }
}
exports.userController = new UserController();
