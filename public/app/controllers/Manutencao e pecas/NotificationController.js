"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationController = void 0;
const Notification_1 = __importDefault(require("../../../models/Manutencao e pecas/Notification"));
const User_1 = __importDefault(require("../../../models/Manutencao e pecas/User"));
class NotificationController {
    async new(users, title, message, link) {
        users.forEach(async (user) => {
            const userNot = await User_1.default.findOne({ name: user });
            if (userNot) {
                const notificationEntry = new Notification_1.default({
                    userId: userNot._id,
                    title,
                    message,
                    link,
                    viewed: false,
                });
                await notificationEntry.save();
                console.log(notificationEntry);
            }
        });
    }
    async byId(req, res) {
        const id = req.params.id;
        const notifications = await Notification_1.default.find({
            userId: id,
            viewed: false,
        });
        return res.status(201).json(notifications);
    }
    async all(req, res) {
        const notifications = await Notification_1.default.find({
            viewed: false,
        });
        return res.status(201).json(notifications);
    }
    async updateNotification(req, res) {
        const notificationId = req.params.id;
        const updated = await Notification_1.default.findByIdAndUpdate(notificationId, {
            viewed: true,
        });
        return res
            .status(201)
            .json({ msg: `${notificationId}: Atualizada`, updated: updated });
    }
}
exports.notificationController = new NotificationController();
